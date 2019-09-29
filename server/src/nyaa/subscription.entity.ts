import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, Unique } from 'typeorm';

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
