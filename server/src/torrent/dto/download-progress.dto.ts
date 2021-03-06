import { ObjectType, Field, Int, registerEnumType } from 'type-graphql';

export enum TORRENT_STATUS {
  SCANNING = 'SCANNING',
  PAUSED = 'PAUSED',
  DOWNLOADING = 'DOWNLOADING',
  DONE = 'DONE',
}

registerEnumType(TORRENT_STATUS, {
  name: 'TORRENT_STATUS',
});

export interface DownloadProgress {
  animeName: string;
  fileName: string;
  progress: number;
  downloadSpeed: number;
  // TODO: Maybe shouldn't be optional
  status?: TORRENT_STATUS;
}

export class DownloadProgressDto implements DownloadProgress {
  animeName: string;
  fileName: string;
  progress: number;
  downloadSpeed: number;
  status: TORRENT_STATUS;
}

@ObjectType()
export class DownloadProgressType implements DownloadProgress {
  @Field()
  animeName: string;
  @Field()
  fileName: string;
  @Field(() => Int)
  progress: number;
  @Field(() => Int)
  downloadSpeed: number;
  @Field(() => TORRENT_STATUS)
  status: TORRENT_STATUS;
}
