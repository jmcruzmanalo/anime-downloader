import { Injectable } from '@nestjs/common';
import { TorrentService } from './torrent/torrent.service';
import { NyaaService } from './nyaa/nyaa.service';
import * as fs from 'fs';

@Injectable()
export class AppService {
  constructor(
    private readonly torrentService: TorrentService,
    private readonly nyaaService: NyaaService,
  ) {
    if (!fs.existsSync(this.torrentService.downloadPath)) {
      fs.mkdirSync(this.torrentService.downloadPath);
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
