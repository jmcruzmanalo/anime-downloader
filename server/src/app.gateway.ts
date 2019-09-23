import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  InternalServerErrorException,
  Logger,
  Injectable,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import {
  DownloadProgressDto,
  DownloadProgress,
} from './torrent/dto/download-progress.dto';
import { TorrentService } from './torrent/torrent.service';

@Injectable()
@WebSocketGateway(5001)
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger('AppGateway');

  @WebSocketServer()
  wss: Server;

  constructor(
    @Inject(forwardRef(() => TorrentService))
    private readonly torrentService: TorrentService,
  ) {}

  handleConnection(client: Socket) {
    this.torrentService.rescanDownloads();
    this.logger.log('A new client has connected.');
  }

  handleDisconnect() {
    this.logger.log('A client has disconnected.');
  }

  emitDownloadUpdate(downloadProgress: DownloadProgress[]) {
    this.wss.emit('downloadUpdate', downloadProgress);
  }
}
