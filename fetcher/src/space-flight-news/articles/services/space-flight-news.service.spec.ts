import { HttpService } from '@nestjs/axios';
import { getQueueToken } from '@nestjs/bull';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { Job, Queue } from 'bull';
import {mock, MockProxy} from 'jest-mock-extended';
import {AxiosResponse} from 'axios'
import { of } from 'rxjs';
import { SpaceFlightNewsService } from './space-flight-news.service';
import * as moment from 'moment';

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

describe('SpaceFlightNewsService', () => {
  let service: SpaceFlightNewsService;

  let articlesQueue: MockProxy<Queue>;
  let mockSchedulerRegistry: MockProxy<SchedulerRegistry>;
  let mockHttpService: MockProxy<HttpService>;
  let mockEventEmitter: MockProxy<EventEmitter2>;

  const mockSpaceArticles = [
    {
      id: 17002,
      title: "Space Force tries to turn over a new leaf in satellite procurement",
      url: "https://spacenews.com/space-force-tries-to-turn-over-a-new-leaf-in-satellite-procurement/",
      imageUrl: "https://spacenews.com/wp-content/uploads/2022/10/Screen-Shot-2022-10-20-at-8.55.19-AM.png",
      newsSite: "SpaceNews",
      summary: "The Space Systems Command next year will seek industry bids for as many as four infrared sensing satellites for missile tracking from medium Earth orbit (MEO).",
      publishedAt: "2022-10-20T17:33:21.000Z",
      updatedAt: "2022-10-20T17:33:21.553Z",
      featured: false,
      launches: [],
      events: []
    },
    {
      id: 17001,
      title: "Why NASA Is Trying To Crash Land on Mars",
      url: "https://mars.nasa.gov/news/9283/",
      imageUrl: "https://mars.nasa.gov/system/news_items/main_images/9283_1-Illustration-of-SHIELD-web.jpg",
      newsSite: "NASA",
      summary: "Like a car’s crumple zone, the experimental SHIELD lander is designed to absorb a hard impact.",
      publishedAt: "2022-10-20T17:13:00.000Z",
      updatedAt: "2022-10-20T17:13:35.034Z",
      featured: false,
      launches: [],
      events: []
    },
  ]

  beforeEach(async () => {
    articlesQueue = mock<Queue>();
    mockSchedulerRegistry = mock<SchedulerRegistry>();
    mockHttpService = mock<HttpService>();
    mockEventEmitter = mock<EventEmitter2>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [SpaceFlightNewsService,
        {provide: getQueueToken('articles_request'), useValue: articlesQueue},
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
      service.canFetchNow = jest.fn().mockReturnValue(true);
      service.list = jest.fn().mockResolvedValue([]);
      
      await service.listOrSchedule(8,10);

      expect(service.canFetchNow).toBeCalled();
      expect(service.list).toBeCalledWith(8,10);
    })

    it('should send the request to the queue and schedule the next pull', async()=>{
      service.canFetchNow = jest.fn().mockReturnValue(false);
      articlesQueue.add.mockResolvedValue({ queue:{ name: 'articles_test' }} as Job)
      service.scheduleNextPull = jest.fn();

      const result = await service.listOrSchedule(8,10);

      expect(service.canFetchNow).toBeCalled();
      expect(articlesQueue.add).toBeCalledWith({ page:8, size:10},
        { timeout: 60 * 1000 })
      expect(service.scheduleNextPull).toBeCalled();
      expect(result).toEqual({ name:'articles_test', data: { page:8, size:10 } })
    })
  })

  describe('tests for list', () => {

    it('should call httpService.get', async()=>{
      mockHttpService.get.mockReturnValue(of<AxiosResponse>({data:[]} as AxiosResponse));

      await service.list(1,10);
      expect(mockHttpService.get).toBeCalledWith(`${process.env.SPACE_HOST}/articles`, {
        params: { _limit: 10, _start: 0, _sort:'id' },
      });
    });

    it('should send articles to the msArticlesQueue and updateLastFetchTime', async()=>{
      mockHttpService.get.mockReturnValue(of<AxiosResponse>({
        data: mockSpaceArticles
      } as AxiosResponse));
      service.scheduleNextPull = jest.fn();
      service.updateLastFetchTime = jest.fn();
      await service.list(1,10);

      expect(service.updateLastFetchTime).toBeCalled();
      expect(mockEventEmitter.emit).toBeCalledWith(
        'articles_fetched',
        mockSpaceArticles
        );
    });
  })

  it('should call httpService.get with a count query', async()=>{
    mockHttpService.get.mockReturnValue(of<AxiosResponse>({
      data: 123
    } as AxiosResponse));
    
    const result =await service.count();
    expect(mockHttpService.get).toBeCalledWith(`${process.env.SPACE_HOST}/articles/count`);
    expect(result).toBe(123);
  });

  describe('lastFetchTime tests', () => {

    let lastFetchTime:Date;

    beforeEach(()=>{
      lastFetchTime =new Date(2022,0,1,0,0,0,0);
      service['lastFetchTime']=lastFetchTime;
    })


    it('should return the same lastFetchTime', () => {
        expect(service.getLastFetchTime()).toBe(lastFetchTime);
    })

    it('should update lastFetchTime',() => {
      const currentTime=new Date();
      service.updateLastFetchTime();
      expect(service['lastFetchTime'].valueOf()).toBeCloseTo(currentTime.valueOf(),2)
    })

    it('should return true', () => {
      service.getLastFetchTime=jest.fn().mockReturnValue(undefined);
      expect(service.canFetchNow()).toBeTruthy();
    })

    it('should return true as diff is negative or 0', () => {
      service.remainingTime=jest.fn().mockReturnValue(0);
      expect(service.canFetchNow()).toBeTruthy();
    })

    
    it('should return false as diff is bigger than 0', () => {
      service.remainingTime=jest.fn().mockReturnValue(2);
      expect(service.canFetchNow()).toBeFalsy();
    })

    it('should return 0', () => {
      service.getLastFetchTime=jest.fn()
      expect(service.remainingTime()).toBe(0);
    })

    it('should return 0 cuz expired', () => {
      service.getLastFetchTime=jest.fn().mockReturnValue(moment().subtract(1,'hour').toDate())
      expect(service.remainingTime()).toBe(0);
    })

    it('should return 50 seconds', () => {
      service.getLastFetchTime=jest.fn().mockReturnValue(moment().subtract(50,'seconds').toDate())
      expect(service.remainingTime()).toBe(250);
    })
  })

  describe('tests for resumenQueue',() => {
    
    it('should call resume from the queue', async ()=>{
      await service.resumenQueue();
      expect(articlesQueue.resume).toBeCalled();
      expect(mockSchedulerRegistry.deleteTimeout).toBeCalledWith('article_list_fetch');
    })
  })

  describe('tests for scheduleNextPull', ()=> {

    it('should call getTimeout and do nothing',async()=>{
      await service.scheduleNextPull();
      expect(articlesQueue.pause).toBeCalled();
      expect(mockSchedulerRegistry.getTimeout).toBeCalledWith('article_list_fetch');
    })

    it('should call resumenQueue',async()=>{
      mockSchedulerRegistry.getTimeout.mockImplementation(()=>{ throw Error()})
      service.canFetchNow=jest.fn().mockReturnValue(true);
      service.resumenQueue=jest.fn();
      await service.scheduleNextPull();
      expect(mockSchedulerRegistry.getTimeout).toThrow();
      expect(service.resumenQueue).toBeCalled();
    })

    it('should set the timeout',async()=>{
      mockSchedulerRegistry.getTimeout.mockImplementation(()=>{ throw Error()})
      service.canFetchNow=jest.fn().mockReturnValue(false);
      service.remainingTime=jest.fn().mockReturnValue(250);
      await service.scheduleNextPull();
      expect(mockSchedulerRegistry.getTimeout).toThrow();
      expect(setTimeout).toBeCalledWith(expect.any(Function),250*1000);
      expect(mockSchedulerRegistry.addTimeout).toBeCalled();
    })
  })
});
