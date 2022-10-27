import { Test, TestingModule } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { QueryDto } from './commons/dtos/query.dto';

describe('ArticlesController', () => {
  let controller: ArticlesController;
  let mockArticleService: MockProxy<ArticlesService>;

  beforeEach(async () => {
    mockArticleService = mock<ArticlesService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        ArticlesService,
        { provide: ArticlesService, useValue: mockArticleService },
      ],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
  });

  describe('test for list', () => {
    it('should call list from service', async () => {
      const query = new QueryDto();
      query.size = 10;
      query.page = 2;
      await controller.list(query);
      expect(mockArticleService.getList).toBeCalledWith(2, 10);
    });
  });
});
