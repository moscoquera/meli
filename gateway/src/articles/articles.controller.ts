import { Controller, Get, Query } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { QueryDto } from './commons/dtos/query.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  public async list(@Query() queryParams: QueryDto) {
    return this.articlesService.getList(queryParams.page, queryParams.size);
  }
}
