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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database:
        __dirname +
        (process.env.NODE_ENV === 'test'
          ? '/../db/test-database.db'
          : '/../db/database.db'),
      synchronize: true,
      logging: false,
      entities: [__dirname + '/**/*.entity.{js,ts}'],
    }),
    GraphQLModule.forRoot({
      playground: true,
      debug: true,
      autoSchemaFile: 'schema.gql',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'client', 'build'),
      renderPath: '/'
    }),
    NyaaModule,
    TorrentModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
  exports: [AppGateway],
})
export class AppModule {}
