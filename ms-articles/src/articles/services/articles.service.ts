import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Article } from '../entities/Article.entity';
import { ConfigEntity } from '../entities/Config.entity';
import { FetcherService } from './fetcher.service';

@Injectable()
export class ArticlesService {

    constructor(@InjectRepository(ConfigEntity) private configRepository: Repository<ConfigEntity>, private fetcherService: FetcherService, @InjectRepository(Article) private articlesRepository: Repository<Article> ){};

    async count(): Promise<number>{
        const countEntity = await this.configRepository.findOne({where:{key:'articles_count'}});
        if(countEntity){
            return parseInt(countEntity.value);
        }
        
        const count = await this.fetcherService.count();
        await this.configRepository.insert({ key: 'articles_count', value: ""+count});
        return count;
    }

    async list(page:number, size:number): Promise<any>{
        const remoteStart = (page-1)*size; //from paginated 1-index to 0 index
        const remotePage = Math.floor(remoteStart/100)+1 //to 1 index again with a different page size
        return await this.fetcherService.list(remotePage,100);
        
    }

    async addOrUpdate(articleData: DeepPartial<Article>){
        const article = this.articlesRepository.create(articleData);
        return this.articlesRepository.save(article);
    }

    
}
