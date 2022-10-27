import { ClientProxy } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';
import { of } from 'rxjs';
import { ArticlesService } from './articles.service';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let mockClientProxy: MockProxy<ClientProxy>;

  beforeEach(async () => {
    mockClientProxy = mock<ClientProxy>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: 'ms-articles',
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
  });

  describe('tests for getList', () => {
    it('should call send from client', async () => {
      mockClientProxy.send.mockImplementation(() => {
        return of(undefined);
      });
      await service.getList(8, 10);
      expect(mockClientProxy.send).toBeCalledWith('articles.list', {
        page: 8,
        size: 10,
      });
    });
  });
});
