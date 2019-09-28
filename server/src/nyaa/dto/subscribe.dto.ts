import { IsNotEmpty } from 'class-validator';
import { ObjectType, Field } from 'type-graphql';

export interface Subscription {
  animeName: string;
}

export class AnimeNameDto implements Subscription {
  @IsNotEmpty()
  animeName: string;
}

@ObjectType()
export class SubscriptionType implements Subscription {
  @Field()
  animeName: string;
}
