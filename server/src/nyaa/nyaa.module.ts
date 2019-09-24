import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NyaaController } from './nyaa.controller';
import { NyaaService } from './nyaa.service';
import { TorrentModule } from '../torrent/torrent.module';
import { SubscriptionEntity } from './subscription.entity';
import { NyaaResolver } from './nyaa.resolver';
import { AppModule } from '../app.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionEntity]),
    forwardRef(() => AppModule),
    forwardRef(() => TorrentModule),
  ],
  controllers: [NyaaController],
  providers: [NyaaService, NyaaResolver],
  exports: [NyaaService],
})
export class NyaaModule {}
