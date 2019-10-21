import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectType, Field, InputType } from 'type-graphql';

export interface NyaaLinks {
  page?: string;
  file?: string;
  magnet: string;
}

export class NyaaLinksDto implements NyaaLinks {
  page: string;
  file: string;

  @IsNotEmpty()
  magnet: string;
}

@ObjectType()
export class NyaaLinksType implements NyaaLinks {
  @Field()
  magnet: string;
}

@InputType()
export class NyaaLinksInput implements NyaaLinks {
  @Field()
  magnet: string;
}

export interface NyaaCategory {
  label: string;
  code: string;
}

export interface NyaaItem {
  category?: NyaaCategory;
  name: string;
  links: NyaaLinks;
  fileSize: string;
  timestamp?: string;
  seeders?: string;
  leechers?: string;
  nbDownload?: string;
}

export class NyaaItemDto {
  category: NyaaCategory;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => NyaaLinksDto)
  links: NyaaLinksDto;

  fileSize: string;
  timestamp: string;
  seeders: string;
  leechers: string;
  nbDownload: string;
}

@ObjectType()
export class NyaaItemType implements NyaaItem {
  @Field()
  name: string;
  @Field()
  fileSize: string;
  @Field()
  nbDownload: string;
  @Field(() => NyaaLinksType)
  links: NyaaLinks;
  @Field()
  timestamp: string;
}

@InputType()
export class NyaaItemInput implements NyaaItem {
  @Field()
  name: string;
  @Field()
  fileSize: string;
  @Field(() => NyaaLinksInput)
  links: NyaaLinks;
}
