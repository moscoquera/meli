import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { sign } from 'crypto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SpaceFlightNewsService {

    readonly host: string;

    constructor(private readonly httpService: HttpService) {
        this.host = process.env.SPACE_HOST;
    }
0
    async list(page: number, size: number){
        return (await firstValueFrom(this.httpService.get(`${this.host}/articles`,{params:{_limit:size, _start:size*(page-1)}}))).data;
    }

    async count(){
        return (await firstValueFrom(this.httpService.get(`${this.host}/articles/count`))).data;
    }

}
