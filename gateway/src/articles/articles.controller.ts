import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ArticlesService } from './articles.service';
import { QueryDto } from './commons/dtos/query.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  public async list(@Query() queryParams: QueryDto,@Res() response: Response) {
    let result = await this.articlesService.getList(queryParams.page, queryParams.size);
    if(!result.data){
      response.status(202);
      result = {
        caching:true
      };
      
    }
    response.send(result);
  }
}
