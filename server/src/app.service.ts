import { Injectable } from '@nestjs/common';
import { TorrentService } from './torrent/torrent.service';
import { NyaaService } from './nyaa/nyaa.service';

@Injectable()
export class AppService {
  constructor(
    private readonly torrentService: TorrentService,
    private readonly nyaaService: NyaaService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }
}
