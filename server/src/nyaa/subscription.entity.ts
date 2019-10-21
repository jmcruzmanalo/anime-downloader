import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, Unique } from 'typeorm';
import { RESOLUTION } from './searchNyaa.interface';

@Entity()
@Unique(['animeName'])
export class SubscriptionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  animeName: string;

  @Column()
  resolution: RESOLUTION;

  @Column({
    nullable: true
  })
  nyaaResponse?: string;
}
