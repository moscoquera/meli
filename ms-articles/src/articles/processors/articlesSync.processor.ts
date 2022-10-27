import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ArticleMessage } from 'commons';
import { Article } from '../entities/Article.entity';
import { ArticlesService } from '../services/articles.service';

@Processor('articles_cache')
export class ArticlesSync {
  constructor(private readonly service: ArticlesService) {}

  @Process()
  async transcode(job: Job<unknown>) {
    const data = job.data as ArticleMessage;
    console.log('procesing from: articles_cache');

    await this.service.addOrUpdate({
      ...data,
    });
    return { status: 'ok' };
  }
}
