import { IsNotEmpty } from 'class-validator';
import { ObjectType, Field, InputType } from 'type-graphql';

export interface Subscription {
  animeName: string;
}

export class AnimeNameDto implements Subscription {
  @IsNotEmpty()
  animeName: string;
}

@InputType()
export class AnimeNameInput implements Subscription {
  @Field()
  animeName: string;
}

@ObjectType()
export class SubscriptionType implements Subscription {
  @Field()
  animeName: string;
}
