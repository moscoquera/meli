import { Module } from '@nestjs/common';
import { ArticlesService } from './services/articles.service';
import { ArticlesController } from './articles.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { FetcherService } from './services/fetcher.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigEntity } from './entities/Config.entity';
import { Article } from './entities/Article.entity';

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
    ])
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService, ConfigService, FetcherService]
})
export class ArticlesModule {}
