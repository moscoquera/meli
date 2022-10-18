import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { sign } from 'crypto';
import moment from 'moment';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SpaceFlightNewsService {

    readonly host: string;
    
    private lastFetchTime: Date = undefined;
    private delayTime: number;

    constructor(private readonly httpService: HttpService) {
        this.host = process.env.SPACE_HOST;
        this.delayTime = parseInt(process.env.DELAY_TIME);
    }
0
    async listOrSchedule(page: number, size: number){
        if(this.canFetchNow()){
            return this.list(page, size);
        }
        
    }

    async list(page: number, size: number){
        return (await firstValueFrom(this.httpService.get(`${this.host}/articles`,{params:{_limit:size, _start:size*(page-1)}}))).data;
    }

    async count(){
        return (await firstValueFrom(this.httpService.get(`${this.host}/articles/count`))).data;
    }

    getLastFetchTime(){
        return this.lastFetchTime;
    }

    updateLastFetchTime(){
        return this.lastFetchTime;
    }

    canFetchNow(){
        if (!this.getLastFetchTime()){
            return true;
        }
        const diff = moment().diff(this.getLastFetchTime(),'seconds');
        return this.delayTime <= diff;
    }

}
