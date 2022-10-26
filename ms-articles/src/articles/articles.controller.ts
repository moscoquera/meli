import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ArticlesService } from './services/articles.service';
import {ListMessage} from 'commons';

@Controller()
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {

  }

  @MessagePattern('articles.list')
  async list(@Payload() data: ListMessage) {
      const result= await this.articlesService.list(data.page, data.size);
      if(result == null){
        return {
          'caching':true
        }
      }
      return result;
  }
}
