import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {ListMessage} from '@meli/commons/index';

@Injectable()
export class ArticlesService {


    constructor(@Inject('ms-articles') private client: ClientProxy){}

    async getList(page: number, size: number){
        return this.client.send('articles.list', {} as ListMessage)
    }

}
