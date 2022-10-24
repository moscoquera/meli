import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SpaceFlightNewsService } from './articles/services/space-flight-news.service';
import { SpaceFlightNewsController } from './articles/space-flight-news.controller';
import { BullModule } from '@nestjs/bull';
import { SpaceFlightNewProcessor } from './articles/processors/space-flight-news.processor';
import { MSArticlesService } from './articles/services/ms-articles.service';
import { ArticlesFetchedListener } from './articles/listeners/articles-fetched.listerner';

@Module({
  imports: [
    HttpModule,
    BullModule.registerQueueAsync(
      {
        name: 'articles_request',
      },
      {
        name: 'articles_cache',
      },
    ),
  ],
  controllers: [SpaceFlightNewsController],
  providers: [
    SpaceFlightNewsService,
    SpaceFlightNewProcessor,
    MSArticlesService,
    ArticlesFetchedListener,
  ],
})
export class SpaceFlightNewsModule {}
