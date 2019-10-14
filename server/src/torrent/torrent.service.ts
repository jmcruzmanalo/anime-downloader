import {
  Injectable,
  Logger,
  ConflictException,
  Inject,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
import * as WebTorrent from 'webtorrent';
import { NyaaItem, NyaaItemDto } from '../nyaa/dto/nyaa-response-item';
import { AppGateway } from '../app.gateway';
import {
  DownloadProgressDto,
  DownloadProgress,
} from './dto/download-progress.dto';
import { throttle } from 'lodash';
import { NyaaService } from '../nyaa/nyaa.service';
import * as fs from 'fs';
import { SubscriptionEntity } from 'src/nyaa/subscription.entity';
import { PubSub } from 'graphql-subscriptions';
import { Subscription } from '../nyaa/dto/subscribe.dto';
import * as os from 'os';
import { join } from 'path';

@Injectable()
export class TorrentService {
  private torrentClient = new WebTorrent();
  private logger = new Logger('TorrentService');
  // public downloadPath = __dirname + '/../downloads';
  public downloadPath = join(os.homedir(), 'Desktop');
  private initialized: boolean = false;

  constructor(
    @Inject(forwardRef(() => NyaaService))
    private readonly nyaaService: NyaaService,
    @Inject('PUB_SUB')
    private readonly pubSub: PubSub,
  ) {
    this.logger.log('Checking download path');
    if (!fs.existsSync(this.downloadPath)) {
      this.logger.log('Creating downloads folder');
      fs.mkdirSync(this.downloadPath);
    }
    this.logger.verbose('Created instasnce of TorrentService');
    this.torrentClient.on('error', error => {
      this.logger.error('There was an error on the torrent client');
      this.logger.error(error);
    });
  }

  async rescanDownloads() {
    if (this.initialized) {
      this.logger.log('Already initialized. rescanDownloads() will not run');
      return;
    }
    this.logger.log('Scanning downloads');
    try {
      const fileNames = fs.readdirSync(this.downloadPath);
      const subscriptions = await this.nyaaService.getSubscriptions();
      subscriptions.forEach((sub: SubscriptionEntity) => {
        fileNames.forEach(fileName => {
          if (sub.nyaaResponse) {
            const nyaaResponse: NyaaItem[] = JSON.parse(sub.nyaaResponse);
            nyaaResponse.forEach((nyaaItem: NyaaItem) => {
              const doesContain = nyaaItem.name
                .toLowerCase()
                .includes(fileName.toLowerCase());
              if (!doesContain) return;
              this.startDownload(nyaaItem);
            });
          }
        });
      });
    } catch (err) {
      if (err.errno === -2) {
        this.logger.error(
          'Downloads folder does not exist. Should work fine after starting a download. Or ask that lazy ass dev to just make the folder on startup if not exist.',
        );
      }
    } finally {
      this.initialized = true;
    }
  }

  startDownload(nyaaItem: NyaaItem, onAdded?: Function): NyaaItem {
    const { name, links } = nyaaItem;
    const { magnet } = links;

    const matchingTorrent = this.torrentClient.torrents.find(
      torrent => torrent.name === name,
    );

    if (matchingTorrent) {
    } else {
      this.torrentClient.add(
        magnet,
        {
          path: this.downloadPath,
        },
        (torrent: WebTorrent.Torrent) => {
          torrent.on('ready', () =>
            this.logger.debug(`${torrent.name} is ready`),
          );
          torrent.on('warning', err => {
            this.logger.debug(`${torrent.name} warning`);
            this.logger.debug(err);
          });
          torrent.on(
            'download',
            throttle(() => {
              const { done } = torrent;
              if (onAdded) onAdded();
              if (done) return;
              this.mapDownloadProgress();
            }, 500),
          );
          torrent.on('done', () => {
            const { progress, name } = torrent;
            this.logger.log(
              `Finished downloading: ${name} - ${Math.floor(progress * 100)}`,
            );
            this.mapDownloadProgress();
          });
          torrent.on('error', err => this.logger.error(err));
          torrent.on('noPeers', () =>
            this.logger.error(`${torrent.name} has no peers`),
          );
          torrent.on('infoHash', () =>
            this.logger.debug(`${torrent.name} infoHash`),
          );
          torrent.on('metadata', () =>
            this.logger.debug(`${torrent.name} metadata`),
          );
        },
      );
    }
    return nyaaItem;
  }

  async startDownloadAll(animeNameInput: Subscription) {
    const { animeName } = animeNameInput;
    const subscriptions = await this.nyaaService.getSubscriptionByAnimeName(
      animeName,
    );
    const nyaaItems: NyaaItem[] = JSON.parse(subscriptions.nyaaResponse);
    nyaaItems.forEach((nyaaItem: NyaaItem) => {
      this.startDownload(nyaaItem);
    });
  }

  async mapDownloadProgress() {
    /**
     * TODO: Optimize, since there is a nested await that calls db.subs over and over again
     */
    let progress: DownloadProgress[] = this.torrentClient.torrents.map(
      (torrent: WebTorrent.Torrent) => {
        const { name, progress, downloadSpeed } = torrent;
        const downloadProgress = new DownloadProgressDto();
        downloadProgress.fileName = name;
        downloadProgress.progress = Math.floor(progress * 100);
        downloadProgress.downloadSpeed = Math.floor(downloadSpeed / 1000);
        // this.logger.verbose(
        //   `${name} - ${downloadProgress.progress}% - ${downloadSpeed}`,
        // );
        return downloadProgress;
      },
    );

    progress = await this.nyaaService.setSubscriptionsFromFileName(progress);

    // this.logger.debug(progress);
    this.pubSub.publish('downloadProgressUpdate', progress);
    // this.gateway.emitDownloadUpdate(progress);
    return progress;
  }
}
