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
    const subscribed = await this.nyaaService.searchSubscribed();
    this.pubSub.publish(SUBSCRIPTION_EVENT.SUB_ADDED, subscribed);
    return subscribed;
  }

  @Mutation(() => NyaaItemType)
  startDownload(@Args('nyaaItem') nyaaItem: NyaaItemInput) {
    return this.torrentService.startDownload(nyaaItem);
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
