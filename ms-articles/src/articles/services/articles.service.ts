import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigEntity } from '../entities/Config.entity';
import { FetcherService } from './fetcher.service';

@Injectable()
export class ArticlesService {

    constructor(@InjectRepository(ConfigEntity) private configRepository: Repository<ConfigEntity>, private fetcherService: FetcherService ){};

    async count(): Promise<number>{
        const countEntity = await this.configRepository.findOne({where:{key:'articles_count'}});
        if(countEntity){
            return parseInt(countEntity.value);
        }
        
        const count = await this.fetcherService.count();
        await this.configRepository.insert({ key: 'articles_count', value: ""+count});
        return count;
    }
}
