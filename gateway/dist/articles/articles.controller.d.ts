import { ArticlesService } from './articles.service';
import { QueryDto } from './commons/dtos/query.dto';
export declare class ArticlesController {
    private readonly articlesService;
    constructor(articlesService: ArticlesService);
    list(queryParams: QueryDto): Promise<any>;
}
