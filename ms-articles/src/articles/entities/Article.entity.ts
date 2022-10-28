import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  Index,
} from 'typeorm';

@Entity('articles')
export class Article {
  @PrimaryColumn('int')
  id: number;

  @Column('varchar', { length: 512, nullable: false })
  title: string;

  @Column('varchar', { length: 512, nullable: false })
  url: string;

  @Column('varchar', { length: 512, nullable: false })
  imageUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Index()
  @Column('int')
  remoteIndex: number;
}
