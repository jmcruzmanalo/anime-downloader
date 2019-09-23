import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { NyaaService } from './nyaa.service';
import {
  SubscribedAnime,
  SubscribedAnimeType,
} from './dto/all-subscribed-anime.dto';
import { TorrentService } from '../torrent/torrent.service';
import { NyaaItemInput, NyaaItemType } from './dto/nyaa-response-item';

@Resolver()
export class NyaaResolver {
  constructor(
    private readonly nyaaService: NyaaService,
    private readonly torrentService: TorrentService,
  ) {}

  @Query(() => [SubscribedAnimeType])
  async subscribedEpisodes(): Promise<SubscribedAnime[]> {
    return await this.nyaaService.searchSubscribed();
  }

  @Mutation(() => NyaaItemType)
  startDownload(@Args('nyaaItem') nyaaItem: NyaaItemInput) {
    return this.torrentService.startDownload(nyaaItem);
  }
}
