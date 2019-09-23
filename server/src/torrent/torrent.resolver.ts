import { Resolver, Query } from '@nestjs/graphql';
import { TorrentService } from './torrent.service';
import {
  DownloadProgressType,
  DownloadProgressDto,
  DownloadProgress,
} from './dto/download-progress.dto';

@Resolver()
export class TorrentResolver {
  constructor(private readonly torrentService: TorrentService) {}

  @Query(() => String)
  async hello() {
    return 'hello';
  }

  @Query(() => [DownloadProgressType])
  async downloadProgress(): Promise<DownloadProgress[]> {
    const progress = await this.torrentService.mapDownloadProgress();
    return progress;
  }
}
