import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SpaceFlightNewsService } from './services/space-flight-news.service';
import { ArticleMessage, ListMessage } from 'commons';
import { ScheduleJobDto } from '../dtos/scheduledJob.dto';
@Controller()
export class SpaceFlightNewsController {
  constructor(
    private readonly spaceFlightNewsService: SpaceFlightNewsService,
  ) {}

  @MessagePattern('articles.list')
  async list(@Payload() data: ListMessage):Promise<ArticleMessage[] | ScheduleJobDto> {
    return this.spaceFlightNewsService.listOrSchedule(data.page, data.size);
  }

  @MessagePattern('articles.list.count')
  async count() {
    return this.spaceFlightNewsService.count();
  }
}
