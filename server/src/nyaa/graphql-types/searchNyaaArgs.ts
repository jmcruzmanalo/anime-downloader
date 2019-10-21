import { ArgsType, Field, registerEnumType } from 'type-graphql';
import { RESOLUTION, SearchNyaa } from '../searchNyaa.interface';

registerEnumType(RESOLUTION, {
  name: 'RESOLUTION',
});

@ArgsType()
export class SearchNyaaArgs implements SearchNyaa {
  @Field()
  searchQuery: string;

  @Field(() => RESOLUTION)
  resolution: RESOLUTION;
}
