import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SpaceFlightNewsModule } from './space-flight-news/space-flight-news.module';

@Module({
  imports: [ConfigModule.forRoot(), SpaceFlightNewsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
