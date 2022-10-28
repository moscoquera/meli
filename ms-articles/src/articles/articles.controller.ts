import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ArticlesService } from './services/articles.service';
import { ListMessage } from 'commons';

@Controller()
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @MessagePattern('articles.list')
  async list(@Payload() data: ListMessage) {
    let page = data.page;
    let size = data.size;
    if (typeof data.page == 'string') {
      page = parseInt(data.page);
    }
    if (typeof data.size == 'string') {
      size = parseInt(data.size);
    }
    const result = await this.articlesService.list(page, size);
    if (result == null) {
      return {
        caching: true,
      };
    }
    return result;
  }
}
