import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { NyaaService } from './nyaa.service';
import {
  SubscribedAnime,
  SubscribedAnimeType,
} from './dto/all-subscribed-anime.dto';
import { TorrentService } from '../torrent/torrent.service';
import { NyaaItemInput, NyaaItemType } from './dto/nyaa-response-item';
import { Inject, Logger } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { SUBSCRIPTION_EVENT } from './subEvent.enum';
import { AnimeNameInput } from './dto/subscribe.dto';

@Resolver()
export class NyaaResolver {
  private logger = new Logger('NyaaResolver');
  constructor(
    private readonly nyaaService: NyaaService,
    private readonly torrentService: TorrentService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}

  @Query(() => [SubscribedAnimeType])
  async subscribedEpisodes(): Promise<SubscribedAnime[]> {
    const subscribed = await this.nyaaService.getSubscriptionEpisodes();
    return subscribed;
  }

  /**
   * TODO: This should probably be in torrent.resolver
   */
  @Mutation(() => NyaaItemType)
  async startDownload(@Args('nyaaItem') nyaaItem: NyaaItemInput) {
    await new Promise(resolve => {
      this.torrentService.startDownload(nyaaItem, resolve);
    });
    return nyaaItem;
  }

  /**
   * TODO: This should be in torrent.resolver
   */
  @Mutation(() => [NyaaItemType])
  async startDownloadAll(
    @Args('animeNameInput') animeNameInput: AnimeNameInput,
  ) {
    this.logger.log(`Starting all downloads for ${animeNameInput.animeName}`);
    await this.torrentService.startDownloadAll(animeNameInput);
    return '';
  }

  @Mutation(() => Boolean)
  async refreshSubscription(
    @Args('animeNameInput') animeNameInput: AnimeNameInput,
  ) {
    return await this.nyaaService.refreshSubscription(animeNameInput);
  }

  @Subscription(() => [SubscribedAnimeType], {
    resolve: value => value,
  })
  subscriptions() {
    /**
     * TODO: Make subscription constants (enums).
     */
    return this.pubSub.asyncIterator(SUBSCRIPTION_EVENT.SUB_ADDED);
  }
}
