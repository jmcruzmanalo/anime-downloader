import { NyaaItemDto, NyaaItem, NyaaItemType } from './nyaa-response-item';
import { ObjectType, Field } from 'type-graphql';

export interface SubscribedAnime {
  animeName: string;
  episodes: NyaaItem[];
}

@ObjectType()
export class SubscribedAnimeType implements SubscribedAnime {
  @Field()
  animeName: string;

  @Field(() => NyaaItemType)
  episodes: NyaaItemType[];
}
