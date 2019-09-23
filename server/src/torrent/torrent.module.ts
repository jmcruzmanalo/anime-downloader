import { Module, Logger, forwardRef } from '@nestjs/common';
import { TorrentService } from './torrent.service';

import { AppGateway } from '../app.gateway';
import { AppModule } from '../app.module';
import { TorrentResolver } from './torrent.resolver';
import { NyaaModule } from '../nyaa/nyaa.module';

@Module({
  imports: [forwardRef(() => AppModule), forwardRef(() => NyaaModule)],
  providers: [TorrentService, TorrentResolver],
  exports: [TorrentService],
})
export class TorrentModule {}
