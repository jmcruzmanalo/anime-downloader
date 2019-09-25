import { Resolver, Query, Subscription } from '@nestjs/graphql';
import { TorrentService } from './torrent.service';
import {
  DownloadProgressType,
  DownloadProgressDto,
  DownloadProgress,
} from './dto/download-progress.dto';
import { PubSub } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common';

@Resolver()
export class TorrentResolver {
  constructor(
    private readonly torrentService: TorrentService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}

  @Query(() => [DownloadProgressType])
  async getDownloadProgress(): Promise<DownloadProgress[]> {
    const progress = await this.torrentService.mapDownloadProgress();
    this.pubSub.publish('downloadProgressUpdate', progress);
    return progress;
  }

  @Subscription(() => [DownloadProgressType], {
    resolve: value => value
  })
  async downloadProgress() {
    return this.pubSub.asyncIterator('downloadProgressUpdate');
  }
}
