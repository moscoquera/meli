import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SpaceFlightNewsModule } from './space-flight-news/space-flight-news.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          redis: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT)
          }
        }
      },
      imports:[]
    }),
    SpaceFlightNewsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
