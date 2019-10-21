import {
  Injectable,
  Logger,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import * as clone from 'clone';
import { si } from 'nyaapi';
import { NyaaItemDto, NyaaItem } from './dto/nyaa-response-item';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionEntity } from './subscription.entity';
import { Repository, QueryFailedError } from 'typeorm';
import { AnimeNameDto, Subscription } from './dto/subscribe.dto';
import {
  DownloadProgressDto,
  DownloadProgress,
} from '../torrent/dto/download-progress.dto';
import { SubscribedAnime } from './dto/all-subscribed-anime.dto';
import { TorrentService } from '../torrent/torrent.service';
import { PubSub } from 'graphql-subscriptions';
import { SUBSCRIPTION_EVENT } from './subEvent.enum';
import { RESOLUTION, SearchNyaa } from './searchNyaa.interface';

@Injectable()
export class NyaaService {
  private logger = new Logger('NyaaService');
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    @Inject(forwardRef(() => TorrentService))
    private torrentService: TorrentService,
    @Inject('PUB_SUB')
    private pubSub: PubSub,
  ) {}

  async search(searchNyaaArgs: SearchNyaa): Promise<NyaaItem[]> {
    try {
      const { searchQuery, resolution } = searchNyaaArgs;
      const searchResult: NyaaItem[] = await si.search(`
      horriblesubs ${searchQuery} ${resolution}`);
      return searchResult;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(
        'Something went wrong in NyaaService.search. See logs',
      );
    }
  }

  async subscribe(searchNyaaArgs: SearchNyaa) {
    const { searchQuery, resolution } = searchNyaaArgs;
    const subscription = new SubscriptionEntity();
    subscription.animeName = searchQuery;
    subscription.resolution = resolution;
    /**
     * TODO: Storing the response as json instead of properly using sqlite. Think about it someday
     * Consider changing nyaaResponse field in Entity to be the NyaaItem[] but have it save as nyaaResponseJSON
     */
    const res = await this.search(searchNyaaArgs);
    subscription.nyaaResponse = JSON.stringify(res);

    try {
      await subscription.save();
    } catch (err) {
      if (err.errno === 19) {
        this.logger.error('Anime subscription already exists.');
        throw new ConflictException('Anime subscription already exists.');
      }
    } finally {
      const subscriptions = await this.getSubscriptionEpisodes();
      this.logger.debug(subscriptions);
      this.pubSub.publish(SUBSCRIPTION_EVENT.SUB_ADDED, subscriptions);
    }
  }

  async refreshSubscription(animeNameDto: Subscription): Promise<Boolean> {
    const { animeName } = animeNameDto;
    const subscription: SubscriptionEntity = await this.subscriptionRepository.findOne(
      {
        where: {
          animeName: animeName.toLowerCase(),
        },
      },
    );
    if (!subscription) {
      throw new NotFoundException(`Anime name "${animeName}" not found`);
    }
    const res = await this.search({
      searchQuery: subscription.animeName,
      resolution: subscription.resolution,
    });
    subscription.nyaaResponse = JSON.stringify(res);
    try {
      await subscription.save();
      return true;
    } catch (err) {
      this.logger.debug(err);
      this.logger.error('Error in updateSubscription');
    } finally {
      const subscriptions = await this.getSubscriptionEpisodes();
      this.pubSub.publish(SUBSCRIPTION_EVENT.SUB_ADDED, subscriptions);
    }
  }

  async unsubscribe(animeNameDto: AnimeNameDto) {
    const { animeName } = animeNameDto;
    const subscription = await this.subscriptionRepository.findOne({
      where: {
        animeName,
      },
    });
    await subscription.remove();
    this.pubSub.publish(
      SUBSCRIPTION_EVENT.SUB_ADDED,
      await this.getSubscriptionEpisodes(),
    );
  }

  async getSubscriptions(): Promise<SubscriptionEntity[]> {
    return await this.subscriptionRepository.find();
  }

  async getSubscriptionByAnimeName(
    animeName: string,
  ): Promise<SubscriptionEntity> {
    const subscription = await this.subscriptionRepository.findOne({
      where: {
        animeName,
      },
    });
    return subscription;
  }

  async getSubscriptionEpisodes(): Promise<SubscribedAnime[]> {
    const subscriptions = await this.getSubscriptions();
    if (!subscriptions) return [];
    return subscriptions.map(sub => {
      const s: SubscribedAnime = {
        animeName: sub.animeName,
        resolution: sub.resolution,
        episodes: JSON.parse(sub.nyaaResponse),
      };
      return s;
    });
  }

  async searchSubscribed(): Promise<SubscribedAnime[]> {
    this.preSearchUpdate(); // no need to await, consider it a side job
    const subscriptions: SubscriptionEntity[] = await this.getSubscriptions();
    const searchQueue: Promise<NyaaItem[]>[] = [];
    const result: SubscribedAnime[] = [];
    subscriptions.forEach(sub => {
      const searchItem: Promise<NyaaItem[]> = this.search({
        searchQuery: sub.animeName,
        resolution: sub.resolution,
      });
      searchQueue.push(searchItem);
    });
    const queueResults = await Promise.all(searchQueue);
    queueResults.forEach((queueResult, index) => {
      subscriptions[index].nyaaResponse = JSON.stringify(queueResult);

      const s: SubscribedAnime = {
        animeName: subscriptions[index].animeName,
        resolution: subscriptions[index].resolution,
        episodes: queueResult,
      };
      result.push(s);
    });

    try {
      for (let x = 0; x < subscriptions.length; x++) {
        await subscriptions[x].save();
      }
    } catch (err) {
      this.logger.error(err);
      this.logger.error('Error saving all the updated searches.');
    }

    return result;
  }

  // Make pubsub output data if nyaaResponse is already in db, then update later
  private async preSearchUpdate() {
    const subscriptions = await this.subscriptionRepository.find();
    const result: SubscribedAnime[] = [];
    subscriptions.forEach(sub => {
      if (sub.nyaaResponse) {
        result.push({
          animeName: sub.animeName,
          resolution: sub.resolution,
          episodes: JSON.parse(sub.nyaaResponse),
        });
      }
    });
    this.pubSub.publish(SUBSCRIPTION_EVENT.SUB_ADDED, result);
  }

  async setSubscriptionsFromFileName(
    downloadProgress: DownloadProgress[],
  ): Promise<DownloadProgress[]> {
    const subscriptions: SubscriptionEntity[] = await this.getSubscriptions();
    let updatedProgress: DownloadProgress[] = clone<DownloadProgress[]>(
      downloadProgress,
    );

    updatedProgress.forEach(p => {
      const subIndex = subscriptions.findIndex(sub => {
        return p.fileName.toLowerCase().includes(sub.animeName.toLowerCase());
      });
      if (subIndex !== -1) {
        p.animeName = subscriptions[subIndex].animeName;
      } else {
        p.animeName = `NOT FOUND IN SUBSCRIPTIONS. If you see this please tell JM.`;
      }
    });

    return updatedProgress;
  }
}
