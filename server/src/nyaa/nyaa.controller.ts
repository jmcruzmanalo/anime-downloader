import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Inject,
  Delete,
} from '@nestjs/common';
import { NyaaService } from './nyaa.service';
import { AnimeNameDto } from './dto/subscribe.dto';
import { TorrentService } from '../torrent/torrent.service';
import { NyaaItemDto } from './dto/nyaa-response-item';
import { PubSub } from 'graphql-subscriptions';
import { SUBSCRIPTION_EVENT } from './subEvent.enum';
import { SubscribedAnime } from './dto/all-subscribed-anime.dto';

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

  @Get('subscriptions')
  async getSubscriptions(): Promise<any> {
    await this.torrentService.rescanDownloads();
    const subscriptions: SubscribedAnime[] = await this.nyaaService.getSubscriptionEpisodes();
    this.pubSub.publish(SUBSCRIPTION_EVENT.SUB_ADDED, subscriptions);
    return subscriptions;
  }

  @Post('startDownload')
  @UsePipes(ValidationPipe)
  async startDownloadViaMagnetLink(@Body() nyaaItemDto: NyaaItemDto) {
    await this.torrentService.startDownload(nyaaItemDto);
  }

  @Delete('unsubscribe')
  @UsePipes(ValidationPipe)
  async deleteSubscription(@Body() animeNameDto: AnimeNameDto) {
    await this.nyaaService.unsubscribe(animeNameDto);
  }
}
