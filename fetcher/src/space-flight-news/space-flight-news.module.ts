import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'
import { SpaceFlightNewsService } from './articles/space-flight-news.service';
import { SpaceFlightNewsController } from './articles/space-flight-news.controller';
import { BullModule } from '@nestjs/bull';
import { SpaceFlightNewProcessor } from './articles/space-flight-news.processor';

@Module({
  imports:[HttpModule, BullModule.registerQueue({
    name: 'articles_request',
  })],
  controllers: [SpaceFlightNewsController],
  providers: [SpaceFlightNewsService, SpaceFlightNewProcessor]
})
export class SpaceFlightNewsModule {}
