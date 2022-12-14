import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleMessage, ScheduleJoMessage } from 'commons';
import { Between, DeepPartial, Repository } from 'typeorm';
import { Article } from '../entities/Article.entity';
import { ConfigEntity } from '../entities/Config.entity';
import { FetcherService } from './fetcher.service';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ConfigEntity)
    private configRepository: Repository<ConfigEntity>,
    private fetcherService: FetcherService,
    @InjectRepository(Article) private articlesRepository: Repository<Article>,
  ) {}

  async count(): Promise<number> {
    const countEntity = await this.configRepository.findOne({
      where: { key: 'articles_count' },
    });
    if (countEntity) {
      return parseInt(countEntity.value);
    }

    const count = await this.fetcherService.count();
    await this.configRepository.insert({
      key: 'articles_count',
      value: '' + count,
    });
    return count;
  }

  async list(page: number, size: number): Promise<any> {
    const startIndex = (page - 1) * size; //from paginated 1-index to 0 index
    const endIndex = startIndex + size;

    const cacheCount = await this.articlesRepository.count();
    let response: ArticleMessage[] | Article[] | ScheduleJoMessage;
    response = await this.articlesRepository.find({
      order: { id: 'ASC' },
      where: {
        remoteIndex: Between(startIndex, endIndex - 1),
      },
    });
    if (response.length == 0) {
      //No data found
      const remotePage = Math.floor(startIndex / 100) + 1; //to 1 index again with a different page size
      response = await this.fetcherService.list(remotePage, 100); //TODO return subset
      if (Array.isArray(response)) {
        const subIndex = startIndex % 100;
        response = response.slice(
          subIndex,
          Math.min(subIndex + size, response.length),
        );
      }
    }

    if (!Array.isArray(response)) {
      return null;
    }

    const data = response.map((article: ArticleMessage | Article) => {
      return {
        id: article.id,
        imageUrl: article.imageUrl,
        title: article.title,
        url: article.url,
      } as ArticleMessage;
    });
    const remoteCount = await this.count();
    const maxCount = Math.max(cacheCount, remoteCount);
    return {
      data,
      size: size,
      page: page,
      totalPages: Math.ceil(maxCount / size),
      totalItems: maxCount,
    };
  }

  async addOrUpdate(articleData: DeepPartial<Article>) {
    const article = this.articlesRepository.create({
      ...articleData,
      title: articleData.title.substring(
        0,
        Math.min(articleData.title.length, 512),
      ),
    });
    return this.articlesRepository.save(article);
  }
}
