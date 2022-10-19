import { HttpService } from '@nestjs/axios';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Queue } from 'bull';
import * as moment from 'moment';
import { firstValueFrom } from 'rxjs';
import { ScheduleJobDto } from '../dtos/scheduledJob.dto';
import { SpaceArticleDto } from '../dtos/SpaceArticle.dto';

@Injectable()
export class SpaceFlightNewsService implements OnApplicationBootstrap{

    readonly host: string;
    
    private lastFetchTime: Date = undefined;
    private delayTime: number;

    constructor(
        @InjectQueue('articles_request') private articlesListQueue: Queue,
        private schedulerRegistry: SchedulerRegistry,
        private readonly httpService: HttpService) {
        this.host = process.env.SPACE_HOST;
        this.delayTime = parseInt(process.env.DELAY_TIME);
    }
    
    async onApplicationBootstrap() {
        this.scheduleNextPull();
    }
0
    async listOrSchedule(page: number, size: number): Promise<SpaceArticleDto[] | ScheduleJobDto>{
        if(this.canFetchNow()){
            return this.list(page, size);
        }
        const job = await this.articlesListQueue.add({page,size},{timeout:60*1000});
        return { name: job.queue.name, data:  {page, size}} as ScheduleJobDto;
    }

    async list(page: number, size: number): Promise<SpaceArticleDto[]>{
        const result = (await firstValueFrom(this.httpService.get(`${this.host}/articles`,{params:{_limit:size, _start:size*(page-1)}}))).data;
        this.updateLastFetchTime();
        return result;
    }

    async count(){
        return (await firstValueFrom(this.httpService.get(`${this.host}/articles/count`))).data;
    }

    getLastFetchTime(){
        return this.lastFetchTime;
    }

    updateLastFetchTime(){
        return this.lastFetchTime=new Date();
    }

    canFetchNow(){
        if (!this.getLastFetchTime()){
            return true;
        }
        const diff = this.remainingTime();
        return diff<=0;
    }

    remainingTime(): number {
        if (!this.getLastFetchTime()){
            return 0;
        }
        return Math.max(0,this.delayTime - moment().diff(this.getLastFetchTime(),'seconds'));
    }

    async scheduleNextPull(){
        await this.articlesListQueue.pause();
        try{
            const timeout = this.schedulerRegistry.getTimeout('article_list_fetch');
            const remainingTime = this.remainingTime()*1000;
            const newTimeout = setTimeout(this.resumenQueue,remainingTime);
            await this.schedulerRegistry.addTimeout('article_list_fetch', newTimeout);
        }catch(eror){
            return this.resumenQueue();
        }
        
        
    }

    async resumenQueue(){
        await this.articlesListQueue.resume();
    }
}
