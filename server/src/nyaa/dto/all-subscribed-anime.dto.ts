import { NyaaItemDto, NyaaItem, NyaaItemType } from './nyaa-response-item';
import { ObjectType, Field } from 'type-graphql';
import { RESOLUTION } from '../searchNyaa.interface';

export interface SubscribedAnime {
  id: number;
  animeName: string;
  resolution: RESOLUTION;
  episodes: NyaaItem[];
}

@ObjectType()
export class SubscribedAnimeType implements SubscribedAnime {
  @Field()
  id: number;

  @Field()
  animeName: string;

  @Field(() => RESOLUTION)
  resolution: RESOLUTION;

  @Field(() => NyaaItemType)
  episodes: NyaaItemType[];
}
