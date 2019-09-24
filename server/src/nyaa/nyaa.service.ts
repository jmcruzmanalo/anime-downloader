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
import { SubscribeDto, Subscription } from './dto/subscribe.dto';
import {
  DownloadProgressDto,
  DownloadProgress,
} from '../torrent/dto/download-progress.dto';
import { SubscribedAnime } from './dto/all-subscribed-anime.dto';
import { TorrentService } from '../torrent/torrent.service';
import { PubSub } from 'graphql-subscriptions';

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

  async search(
    query: string,
    resolution: number = 1080,
    sub: string = 'horriblesubs',
  ): Promise<NyaaItem[]> {
    try {
      const searchResult: NyaaItem[] = await si.search(`
      ${sub} ${query} ${resolution}p`);
      return searchResult;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(
        'Something went wrong in NyaaService.search. See logs',
      );
    }
  }

  async subscribe(subscribeDto: SubscribeDto) {
    const { animeName } = subscribeDto;
    const subscription = new SubscriptionEntity();
    subscription.animeName = animeName.toLowerCase();
    /**
     * TODO: Storing the response as json instead of properly using sqlite. Think about it someday
     * Consider changing nyaaResponse field in Entity to be the NyaaItem[] but have it save as nyaaResponseJSON
     */
    subscription.nyaaResponse = JSON.stringify(await this.search(animeName));

    try {
      await subscription.save();
      const subscriptions = await this.searchSubscribed();
      this.pubSub.publish('subscriptionAdded', subscriptions);
    } catch (err) {
      this.logger.error(err);
      if (err.errno === 19) {
        throw new ConflictException('Anime subscription already exists.');
      }
    }
  }

  async getSubscriptions(): Promise<SubscriptionEntity[]> {
    return await this.subscriptionRepository.find();
  }

  async searchSubscribed(): Promise<SubscribedAnime[]> {
    const subscriptions: SubscriptionEntity[] = await this.getSubscriptions();
    const searchQueue: Promise<NyaaItem[]>[] = [];
    const result: SubscribedAnime[] = [];
    subscriptions.forEach(sub => {
      const searchItem: Promise<NyaaItem[]> = this.search(sub.animeName);
      searchQueue.push(searchItem);
    });
    const queueResults = await Promise.all(searchQueue);
    queueResults.forEach((queueResult, index) => {
      subscriptions[index].nyaaResponse = JSON.stringify(queueResult);

      const s: SubscribedAnime = {
        animeName: subscriptions[index].animeName,
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
