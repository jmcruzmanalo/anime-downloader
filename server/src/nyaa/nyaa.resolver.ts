import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { NyaaService } from './nyaa.service';
import {
  SubscribedAnime,
  SubscribedAnimeType,
} from './dto/all-subscribed-anime.dto';
import { TorrentService } from '../torrent/torrent.service';
import {
  NyaaItemInput,
  NyaaItemType,
  NyaaItem,
} from './dto/nyaa-response-item';
import { Inject, Logger } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { SUBSCRIPTION_EVENT } from './subEvent.enum';
import { AnimeNameInput } from './dto/subscribe.dto';
import { SearchNyaaArgs } from './graphql-types/searchNyaaArgs';
import { RefreshQueryArgs } from './graphql-types/refreshQueryArgs';

@Resolver()
export class NyaaResolver {
  private logger = new Logger('NyaaResolver');
  constructor(
    private readonly nyaaService: NyaaService,
    private readonly torrentService: TorrentService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}

  @Query(() => [NyaaItemType])
  async searchNyaa(
    @Args()
    searchNyaaArgs: SearchNyaaArgs,
  ): Promise<NyaaItem[]> {
    const res: NyaaItem[] = await this.nyaaService.search(searchNyaaArgs);
    return res;
  }

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

  @Mutation(() => Boolean)
  async subscribeToSearchQuery(@Args() searchNyaaArgs: SearchNyaaArgs) {
    await this.nyaaService.subscribe(searchNyaaArgs);
    return true;
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
  async refreshSubscription(@Args() refreshQuery: RefreshQueryArgs) {
    return await this.nyaaService.refreshSubscription(refreshQuery);
  }

  @Subscription(() => [SubscribedAnimeType], {
    resolve: value => value,
  })
  subscriptions() {
    /**
     * TODO: Make subscription constants (enums).
     */
    this.logger.debug('Someone has subscribed');
    return this.pubSub.asyncIterator(SUBSCRIPTION_EVENT.SUB_ADDED);
  }
}
