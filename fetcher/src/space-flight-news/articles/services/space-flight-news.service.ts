import { HttpService } from '@nestjs/axios';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Queue } from 'bull';
import {} from '@nestjs/bull'
import * as moment from 'moment';
import { firstValueFrom } from 'rxjs';
import { ScheduleJobDto } from '../../dtos/scheduledJob.dto';
import { SpaceArticleDto } from '../../dtos/SpaceArticle.dto';

@Injectable()
export class SpaceFlightNewsService implements OnApplicationBootstrap {
  readonly host: string;

  private lastFetchTime: Date = undefined;
  private delayTime: number;

  constructor(
    @InjectQueue('articles_request') private articlesListQueue: Queue,
    private schedulerRegistry: SchedulerRegistry,
    private readonly httpService: HttpService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.host = process.env.SPACE_HOST;
    this.delayTime = parseInt(process.env.DELAY_TIME);
  }

  async onApplicationBootstrap() {
    this.scheduleNextPull();
  }

  async listOrSchedule(
    page: number,
    size: number,
  ): Promise<SpaceArticleDto[] | ScheduleJobDto> {
    if (this.canFetchNow()) {
      return this.list(page, size);
    }
    const job = await this.articlesListQueue.add(
      { page, size },
      { timeout: 60 * 1000 },
    );
    await this.scheduleNextPull();
    return { name: job.queue.name, data: { page, size } } as ScheduleJobDto;
  }

  async list(page: number, size: number): Promise<SpaceArticleDto[]> {
    const result = (
      await firstValueFrom(
        this.httpService.get(`${this.host}/articles`, {
          params: { _limit: size, _start: size * (page - 1), _sort:'id' },
        }),
      )
    ).data;
    this.updateLastFetchTime();
    this.eventEmitter.emit('articles_fetched', result);
    return result;
  }

  async count() {
    return (
      await firstValueFrom(this.httpService.get(`${this.host}/articles/count`))
    ).data;
  }

  getLastFetchTime() {
    return this.lastFetchTime;
  }

  updateLastFetchTime() {
    return (this.lastFetchTime = new Date());
  }

  canFetchNow() {
    if (!this.getLastFetchTime()) {
      return true;
    }
    const diff = this.remainingTime();
    return diff <= 0;
  }

  remainingTime(): number {
    if (!this.getLastFetchTime()) {
      return 0;
    }
    return Math.max(
      0,
      this.delayTime - moment().diff(this.getLastFetchTime(), 'seconds'),
    );
  }

  async scheduleNextPull() {
    await this.articlesListQueue.pause();
    try {
      this.schedulerRegistry.getTimeout('article_list_fetch');
      //console.log("existing timeout ");
    } catch (eror) {
      //console.log("no timeout")
      if (this.canFetchNow()) {
        return this.resumenQueue();
      }
      const remainingTime = this.remainingTime() * 1000;
      //console.log('scheduled for: '+remainingTime);
      const newTimeout = setTimeout(
        this.resumenQueue.bind(this),
        remainingTime,
      );
      await this.schedulerRegistry.addTimeout('article_list_fetch', newTimeout);
      //console.log('scheduled for: '+remainingTime);
    }
  }

  async resumenQueue() {
    await this.articlesListQueue.resume();
    try {
      await this.schedulerRegistry.deleteTimeout('article_list_fetch');
    } catch (err) {}
  }
}
