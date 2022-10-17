import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ArticlesService } from './articles.service';
import {ListMessage} from '@meli/commons/index';

@Controller()
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {

  }

  @MessagePattern('articles.list')
  async list(@Payload() data: ListMessage) {
      return data;
  }
}
