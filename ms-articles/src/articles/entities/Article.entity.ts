import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity('articles')
export class Article {

    @PrimaryColumn('int')
    id: number;

    @Column('varchar2',{ length: 100, nullable: false})
    title: string;

    @Column('varchar2', { length: 256, nullable: false})
    url: string;

    
    @Column('varchar2', { length: 256, nullable: false})
    imageUrl: string;

    @CreateDateColumn({name:'created_at'})
    createdAt: Date;
}
