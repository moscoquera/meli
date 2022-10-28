import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ScheduleJoMessage } from 'commons';
import { mock, MockProxy } from 'jest-mock-extended';
import { Between, Repository } from 'typeorm';
import { Article } from '../entities/Article.entity';
import { ConfigEntity } from '../entities/Config.entity';
import { ArticlesService } from './articles.service';
import { FetcherService } from './fetcher.service';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let mockConfigRepository: MockProxy<Repository<ConfigEntity>>;
  let mockArticleRepository: MockProxy<Repository<Article>>;
  let mockFetcherService: MockProxy<FetcherService>;

  const mockArticles = [
    {
      id: 17002,
      title:
        'Space Force tries to turn over a new leaf in satellite procurement',
      url: 'https://spacenews.com/space-force-tries-to-turn-over-a-new-leaf-in-satellite-procurement/',
      imageUrl:
        'https://spacenews.com/wp-content/uploads/2022/10/Screen-Shot-2022-10-20-at-8.55.19-AM.png',
    },
    {
      id: 17001,
      title: 'Why NASA Is Trying To Crash Land on Mars',
      url: 'https://mars.nasa.gov/news/9283/',
      imageUrl:
        'https://mars.nasa.gov/system/news_items/main_images/9283_1-Illustration-of-SHIELD-web.jpg',
    },
  ] as Article[];

  let remoteMockArticles = [];

  beforeAll(() => {
    for (let index = 0; index < 100; index++) {
      remoteMockArticles.push({ ...mockArticles[0], id: index });
    }
  });

  beforeEach(async () => {
    mockConfigRepository = mock<Repository<ConfigEntity>>();
    mockArticleRepository = mock<Repository<Article>>();
    mockFetcherService = mock<FetcherService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: getRepositoryToken(ConfigEntity),
          useValue: mockConfigRepository,
        },
        {
          provide: getRepositoryToken(Article),
          useValue: mockArticleRepository,
        },
        {
          provide: FetcherService,
          useValue: mockFetcherService,
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
  });

  describe('test for count', () => {
    it('should return cached value', async () => {
      mockConfigRepository.findOne.mockResolvedValue({
        value: '1520',
        key: 'articles_count',
      });

      const result = await service.count();

      expect(mockConfigRepository.findOne).toBeCalledTimes(1);
      expect(result).toBe(1520);
    });

    it('should grab count from fetcher and save it', async () => {
      mockConfigRepository.findOne.mockResolvedValue(undefined);
      mockFetcherService.count.mockResolvedValue(1020);
      const result = await service.count();

      expect(mockFetcherService.count).toBeCalledTimes(1);
      expect(mockConfigRepository.insert).toBeCalledWith({
        key: 'articles_count',
        value: '1020',
      });
      expect(result).toBe(1020);
    });
  });

  describe('test for list', () => {
    it('should call find from the local repository', async () => {
      mockArticleRepository.count.mockResolvedValue(100);
      mockArticleRepository.find.mockResolvedValue(mockArticles);
      service.count = jest.fn().mockResolvedValue(200);
      const result = await service.list(5, 10);

      expect(mockArticleRepository.count).toBeCalled();
      expect(mockArticleRepository.find).toBeCalledWith({
        order: { id: 'ASC' },
        where: {
          remoteIndex: Between(40, 49),
        },
      });
      expect(result).toEqual({
        data: mockArticles,
        size: 10,
        page: 5,
        totalPages: 20,
        totalItems: 200,
      });
    });

    it('should call list from the fetcher service', async () => {
      mockArticleRepository.count.mockResolvedValue(0);
      mockArticleRepository.find.mockResolvedValue([]);
      mockFetcherService.list.mockResolvedValue(remoteMockArticles);
      service.count = jest.fn().mockResolvedValue(200);
      const result = await service.list(5, 10);

      expect(mockArticleRepository.count).toBeCalled();
      expect(mockFetcherService.list).toBeCalledWith(1, 100);
      expect(result).toEqual({
        data: remoteMockArticles.slice(40, 50),
        size: 10,
        page: 5,
        totalPages: 20,
        totalItems: 200,
      });
    });

    it('should call list and return null', async () => {
      mockArticleRepository.count.mockResolvedValue(0);
      mockFetcherService.list.mockResolvedValue({
        name: 'fake-job',
      } as ScheduleJoMessage);
      mockArticleRepository.find.mockResolvedValue([]);
      service.count = jest.fn().mockResolvedValue(200);
      const result = await service.list(5, 10);

      expect(mockArticleRepository.count).toBeCalled();
      expect(mockFetcherService.list).toBeCalledWith(1, 100);
      expect(result).toBe(null);
    });
  });

  describe('tests for addOrUpdate', () => {
    it('should call create and save from the repo', async () => {
      mockArticleRepository.create.mockImplementation(() => {
        return mockArticles[0];
      });

      await service.addOrUpdate(mockArticles[0]);
      expect(mockArticleRepository.create).toBeCalledWith(mockArticles[0]);
      expect(mockArticleRepository.save).toBeCalledWith(mockArticles[0]);
    });
  });
});
