import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, Unique } from 'typeorm';
import { IsOptional } from 'class-validator';

@Entity()
@Unique(['animeName'])
export class SubscriptionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  animeName: string;

  @Column({
    nullable: true
  })
  nyaaResponse?: string;
}
