import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SpaceArticleDto } from 'src/space-flight-news/dtos/SpaceArticle.dto';
import { MSArticlesService } from '../services/ms-articles.service';

@Injectable()
export class ArticlesFetchedListener {
  constructor(private readonly articlesService: MSArticlesService) {}

  @OnEvent('articles_fetched', { async: true })
  handle(data: SpaceArticleDto[]) {
    console.log('event listened: articles.fetched');
    return this.articlesService.send(data);
  }
}
