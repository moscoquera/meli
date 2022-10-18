import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Injectable()
export class FetcherService {

    constructor(@Inject('fetcher') private fetcherService: ClientProxy) {}

    async count(): Promise<number>{
        const result = await firstValueFrom(this.fetcherService.send('articles.list.count',{}))
        return parseInt(result);
    }

    async list(page:number, size:number): Promise<any>{
        return await firstValueFrom(this.fetcherService.send('articles.list',{size, page}));
    }


}