import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { ArticleMessage } from 'commons';
import { SpaceArticleDto } from 'src/space-flight-news/dtos/SpaceArticle.dto';

@Injectable()
export class MSArticlesService {
  constructor(@InjectQueue('articles_cache') private articlesQueue: Queue) {}

  public async send(
    articles: ArticleMessage[] | SpaceArticleDto[],
  ): Promise<void> {
    const jobs = articles.map((article: ArticleMessage | SpaceArticleDto) => {
      return {
        data: {
          id: article.id,
          title: article.title,
          url: article.url,
          imageUrl: article.imageUrl,
        } as ArticleMessage,
      };
    });
    await this.articlesQueue.addBulk(jobs);
    console.info(`bulk added: ${jobs.length}`);
  }
}
