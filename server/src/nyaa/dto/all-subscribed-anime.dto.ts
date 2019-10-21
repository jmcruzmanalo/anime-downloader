import { NyaaItemDto, NyaaItem, NyaaItemType } from './nyaa-response-item';
import { ObjectType, Field } from 'type-graphql';
import { RESOLUTION } from '../searchNyaa.interface';

export interface SubscribedAnime {
  animeName: string;
  resolution: RESOLUTION;
  episodes: NyaaItem[];
}

@ObjectType()
export class SubscribedAnimeType implements SubscribedAnime {
  @Field()
  animeName: string;

  @Field(() => RESOLUTION)
  resolution: RESOLUTION;

  @Field(() => NyaaItemType)
  episodes: NyaaItemType[];
}
