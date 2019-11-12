import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class RefreshQueryArgs {
  @Field()
  queryId: number
}