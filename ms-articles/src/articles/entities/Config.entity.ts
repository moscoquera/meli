import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({name:'config'})
export class ConfigEntity {

    @PrimaryColumn("varchar", {length: 20})
    key:string;

    @Column({type:'varchar', length: 2000})
    value:string;

}