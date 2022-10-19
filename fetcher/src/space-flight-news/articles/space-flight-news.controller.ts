import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SpaceFlightNewsService } from './services/space-flight-news.service';
import {ListMessage} from 'commons'
@Controller()
export class SpaceFlightNewsController {
  constructor(private readonly spaceFlightNewsService: SpaceFlightNewsService) {
    
  }

  @MessagePattern('articles.list')
  async list(@Payload() data: ListMessage){
    return this.spaceFlightNewsService.listOrSchedule(data.page, data.size);
  }

  @MessagePattern('articles.list.count')
  async count(){
    return this.spaceFlightNewsService.count();
  }
}
