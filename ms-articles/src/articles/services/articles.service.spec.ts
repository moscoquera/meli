import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mock, MockProxy } from 'jest-mock-extended';
import { Repository } from 'typeorm';
import { Article } from '../entities/Article.entity';
import { ConfigEntity } from '../entities/Config.entity';
import { ArticlesService } from './articles.service';
import { FetcherService } from './fetcher.service';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let mockConfigRepository: MockProxy<Repository<ConfigEntity>>;
  let mockArticleRepository: MockProxy<Repository<Article>>;
  let mockFetcherService: MockProxy<FetcherService>;

  beforeEach(async () => {
    mockConfigRepository = mock<Repository<ConfigEntity>>();
    mockArticleRepository = mock<Repository<Article>>();
    mockFetcherService = mock<FetcherService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticlesService, 
        {
          provide: getRepositoryToken(ConfigEntity),
          useValue: mockConfigRepository
        },
        {
          provide: getRepositoryToken(Article),
          useValue: mockArticleRepository
        },
        {
          provide: FetcherService,
          useValue: mockFetcherService
        }
    ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
  });

  describe('test for count', () => {


    it('should return cached value', async() => {

      mockConfigRepository.findOne.mockResolvedValue({ value: '1520', key:'articles_count'})
      
      const result = await service.count();

      expect(mockConfigRepository.findOne).toBeCalledTimes(1);
      expect(result).toBe(1520);
    })

    it('should grab count from fetcher and save it', async() => {
      mockConfigRepository.findOne.mockResolvedValue(undefined)
      mockFetcherService.count.mockResolvedValue(1020);
      const result = await service.count();

      expect(mockFetcherService.count).toBeCalledTimes(1);
      expect(mockConfigRepository.insert).toBeCalledWith({ key: 'articles_count', value: '1020'})
      expect(result).toBe(1020);
    })

  })
});
