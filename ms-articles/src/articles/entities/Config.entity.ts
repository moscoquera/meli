import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({name:'config'})
export class ConfigEntity {

    @PrimaryColumn("varchar2", {length: 20})
    key:string;

    @Column({type:'varchar2', length: 2000})
    value:string;

}