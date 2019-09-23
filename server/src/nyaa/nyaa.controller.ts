import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  ConflictException,
} from '@nestjs/common';
import { NyaaService } from './nyaa.service';
import { SubscribeDto } from './dto/subscribe.dto';
import { TorrentService } from '../torrent/torrent.service';
import { NyaaItemDto } from './dto/nyaa-response-item';

@Controller('nyaa')
export class NyaaController {
  constructor(
    private readonly nyaaService: NyaaService,
    private readonly torrentService: TorrentService,
  ) {}

  @Get()
  index() {
    return 'Ei wassap';
  }

  @Get('search')
  async search() {
    return await this.nyaaService.search('kimetsu no yaiba');
  }

  @Get('subscriptions')
  async getSubscriptions(): Promise<any> {
    this.torrentService.rescanDownloads();
    return await this.nyaaService.searchSubscribed();
  }

  @Post('subscribe')
  @UsePipes(ValidationPipe)
  async subscribeToAnime(@Body() subscrbieDto: SubscribeDto) {
    await this.nyaaService.subscribe(subscrbieDto);
  }

  @Post('startDownload')
  @UsePipes(ValidationPipe)
  async startDownloadViaMagnetLink(@Body() nyaaItemDto: NyaaItemDto) {
    await this.torrentService.startDownload(nyaaItemDto);
  }
}
