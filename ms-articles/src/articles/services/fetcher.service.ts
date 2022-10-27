import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ArticleMessage, ScheduleJoMessage } from 'commons';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FetcherService {
  constructor(@Inject('fetcher') private fetcherService: ClientProxy) {}

  async count(): Promise<number> {
    const result = await firstValueFrom(
      this.fetcherService.send('articles.list.count', {}),
    );
    return parseInt(result);
  }

  async list(
    page: number,
    size: number,
  ): Promise<ArticleMessage[] | ScheduleJoMessage> {
    return firstValueFrom(
      this.fetcherService.send<ArticleMessage[] | ScheduleJoMessage>(
        'articles.list',
        { size, page },
      ),
    );
  }
}
