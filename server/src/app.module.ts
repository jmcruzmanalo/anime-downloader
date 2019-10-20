import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NyaaModule } from './nyaa/nyaa.module';
import { TorrentModule } from './torrent/torrent.module';
import { AppGateway } from './app.gateway';
import { GraphQLModule } from '@nestjs/graphql';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PubSub } from 'graphql-subscriptions';
import { SubscriptionEntity } from './nyaa/subscription.entity';
import * as os from 'os';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join(os.homedir(), 'Desktop', 'animeDownloader.db'),
      synchronize: true,
      logging: false,
      entities: [__dirname + '/**/*.entity.{js,ts}'],
      
    }),
    GraphQLModule.forRoot({
      playground: true,
      debug: true,
      autoSchemaFile: 'schema.gql',
      installSubscriptionHandlers: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'client'), // Prod always. Add a config for dev to change path
      renderPath: '/',
    }),
    NyaaModule,
    TorrentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppGateway,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  exports: [AppGateway, 'PUB_SUB'],
})
export class AppModule {}
