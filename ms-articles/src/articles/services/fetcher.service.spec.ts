import { ClientProxy } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';
import { of } from 'rxjs';
import { Article } from '../entities/Article.entity';
import {FetcherService} from './fetcher.service'

describe('tests for fetcher Service', () => {

    let service: FetcherService;
    let mockClientProxy: MockProxy<ClientProxy>
    
  
    const mockArticles = [
      {
          id: 17002,
          title: "Space Force tries to turn over a new leaf in satellite procurement",
          url: "https://spacenews.com/space-force-tries-to-turn-over-a-new-leaf-in-satellite-procurement/",
          imageUrl: "https://spacenews.com/wp-content/uploads/2022/10/Screen-Shot-2022-10-20-at-8.55.19-AM.png"
      },
      {
          id: 17001,
          title: "Why NASA Is Trying To Crash Land on Mars",
          url: "https://mars.nasa.gov/news/9283/",
          imageUrl: "https://mars.nasa.gov/system/news_items/main_images/9283_1-Illustration-of-SHIELD-web.jpg",
      },
  ] as Article[];
  
    beforeEach(async () => {
      mockClientProxy = mock<ClientProxy>();

      const module: TestingModule = await Test.createTestingModule({
        providers: [FetcherService, 
          {
            provide: 'fetcher',
            useValue: mockClientProxy
          },
      ],
      }).compile();
  
      service = module.get<FetcherService>(FetcherService);
    });

    describe('tests for count', () => {

        it('should call send from proxyClient', async()=>{
            mockClientProxy.send.mockImplementation(()=>{
                return of('120');
            });
            const result = await service.count();
            expect(mockClientProxy.send).toBeCalledWith('articles.list.count',{});
            expect(result).toBe(120)
        })
    })

    describe('tests for list', () => {

        it('should call send from proxyClient', async()=>{
            mockClientProxy.send.mockImplementation(()=>{
                return of(mockArticles);
            });
            const result = await service.list(2,100);
            expect(mockClientProxy.send).toBeCalledWith('articles.list',{size:100, page:2});
            expect(result).toEqual(mockArticles)
        })
    })

})