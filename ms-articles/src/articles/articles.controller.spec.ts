import { Test, TestingModule } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './services/articles.service';

describe('ArticlesController', () => {
  let controller: ArticlesController;

  let serviceMock: MockProxy<ArticlesService>;

  const mockSpaceArticles = [
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
]

  beforeEach(async () => {

    serviceMock = mock<ArticlesService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [{
        provide:ArticlesService,
        useValue: serviceMock
      }],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
  });

  describe('tests for list', () => {
    
    it('should call list from service and return caching', async () => {
        serviceMock.list.mockResolvedValue(null);

        const result = await controller.list({size:10, page:5});

        expect(serviceMock.list).toBeCalledWith(5,10);
        expect(result).toEqual({caching:true})
    })

    it('should call list from service and return its result', async () => {
      serviceMock.list.mockResolvedValue(mockSpaceArticles);

      const result = await controller.list({size:10, page:5});

      expect(serviceMock.list).toBeCalledWith(5,10);
      expect(result).toEqual(mockSpaceArticles)
  })
  })

});
