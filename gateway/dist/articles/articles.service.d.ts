import { ClientProxy } from '@nestjs/microservices';
export declare class ArticlesService {
    private client;
    constructor(client: ClientProxy);
    getList(page: number, size: number): Promise<import("rxjs").Observable<any>>;
}
