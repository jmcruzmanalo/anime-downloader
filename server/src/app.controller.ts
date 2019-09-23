import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { TorrentService } from './torrent/torrent.service';
import * as openExplorer from 'open-file-explorer';

@Controller()
export class AppController {
  private logger = new Logger('AppController');
  constructor(
    private readonly appService: AppService,
    private readonly torrentService: TorrentService,
  ) {}

  @Get('openDownloadsDirectory')
  openDownloadsDirectory() {
    openExplorer(this.torrentService.downloadPath, err => {
      if (err) {
        this.logger.error(err);
        this.logger.error(
          `There was an error opening the folder at ${
            this.torrentService.downloadPath
          }`,
        );
      }
    });
  }
}
