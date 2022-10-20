import { HttpService } from '@nestjs/axios';
import { getQueueToken } from '@nestjs/bull';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { Queue } from 'bull';
import {mock, MockProxy} from 'jest-mock-extended'
import { SpaceFlightNewsService } from './space-flight-news.service';

describe('SpaceFlightNewsService', () => {
  let service: SpaceFlightNewsService;

  let articlesQueue: MockProxy<Queue>;
  let mockSchedulerRegistry: MockProxy<SchedulerRegistry>;
  let mockHttpService: MockProxy<HttpService>;
  let mockEventEmitter: MockProxy<EventEmitter2>;

  beforeEach(async () => {
    articlesQueue = mock<Queue>();
    mockSchedulerRegistry = mock<SchedulerRegistry>();
    mockHttpService = mock<HttpService>();
    mockEventEmitter = mock<EventEmitter2>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [SpaceFlightNewsService,
        {provide: getQueueToken(process.env.QUEUE_ARTICLES_REQUEST), useValue: articlesQueue},
        {provide: SchedulerRegistry, useValue: mockSchedulerRegistry},
        {provide: HttpService, useValue: mockHttpService},
        {provide: EventEmitter2, useValue: mockEventEmitter}
      ],
    }).compile();

    service = module.get<SpaceFlightNewsService>(SpaceFlightNewsService);
  });

  it('should call scheduleNextPull on onApplicationBootstrap', async () => {
    service.scheduleNextPull = jest.fn().mockResolvedValue(undefined);
    await service.onApplicationBootstrap();
    expect(service.scheduleNextPull).toBeCalled();
  });

  describe('tests for listOrSchedule', () => {

    it('should inmidiatly call list as its possible to fetch now', async() => {
      service.canFetchNow = jest.fn().mockResolvedValue(true);
      service.list = jest.fn().mockResolvedValue([]);
      
      await service.listOrSchedule(8,10);

      expect(service.canFetchNow).toBeCalled();
      expect(service.list).toBeCalledWith(8,10);
    }
    )

  })
});
