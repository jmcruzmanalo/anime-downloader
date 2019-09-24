import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { NyaaService } from './nyaa.service';
import { SubscribeDto } from './dto/subscribe.dto';
import { TorrentService } from '../torrent/torrent.service';
import { NyaaItemDto } from './dto/nyaa-response-item';
import { PubSub } from 'graphql-subscriptions';

@Controller('nyaa')
export class NyaaController {
  constructor(
    private readonly nyaaService: NyaaService,
    private readonly torrentService: TorrentService,
    @Inject('PUB_SUB')
    private pubSub: PubSub,
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
    await this.torrentService.rescanDownloads();
    const subscriptions = await this.nyaaService.searchSubscribed();
    this.pubSub.publish('subscriptionAdded', subscriptions);
    return subscriptions;
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
