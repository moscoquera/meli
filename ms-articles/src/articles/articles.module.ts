import { Module } from '@nestjs/common';
import { ArticlesService } from './services/articles.service';
import { ArticlesController } from './articles.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { FetcherService } from './services/fetcher.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigEntity } from './entities/Config.entity';
import { Article } from './entities/Article.entity';
import { ArticlesSync } from './listeners/articlesSync.listener';
import { BullModule } from '@nestjs/bull';

@Module({
  imports:[
    TypeOrmModule.forFeature([ConfigEntity, Article]),
    ClientsModule.register([
      {
        name:'fetcher',
        transport: Transport.TCP,
        options:{
          host: 'fetcher',
          port: 8891,
        }
      }
    ]),
    BullModule.registerQueue({
      name: 'articles_cache',
    })
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService, ConfigService, FetcherService, ArticlesSync]
})
export class ArticlesModule {}
