import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { mock, MockProxy } from 'jest-mock-extended';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { QueryDto } from './commons/dtos/query.dto';

describe('ArticlesController', () => {
  let controller: ArticlesController;
  let mockArticleService: MockProxy<ArticlesService>;
  let mockResponse: MockProxy<Response>;

  beforeEach(async () => {
    mockArticleService = mock<ArticlesService>();
    mockResponse = mock<Response>();
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
      mockArticleService.getList.mockResolvedValue({data:[]})
      const query = new QueryDto();
      query.size = 10;
      query.page = 2;
      await controller.list(query,mockResponse);
      expect(mockArticleService.getList).toBeCalledWith(2, 10);
      expect(mockResponse.send).toBeCalled();
    });

    it('should set status as 202', async () => {
      mockArticleService.getList.mockResolvedValue({})
      const query = new QueryDto();
      query.size = 10;
      query.page = 2;
      await controller.list(query,mockResponse);
      expect(mockArticleService.getList).toBeCalledWith(2, 10);
      expect(mockResponse.status).toBeCalledWith(202);
    });

  });
});
