import { HttpService } from '@nestjs/axios';
import { getQueueToken } from '@nestjs/bull';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { Queue } from 'bull';
import { mock, MockProxy } from 'jest-mock-extended';
import { MSArticlesService } from './ms-articles.service';

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

describe('SpaceFlightNewsService', () => {
    let service: MSArticlesService;

    let articlesQueue: MockProxy<Queue>;

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
            events: [],
            remoteIndex:1
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
            events: [],
            remoteIndex:2
        },
    ]

    const mockSendArticles = [
        {
            data: {
                id: 17002,
                title: "Space Force tries to turn over a new leaf in satellite procurement",
                url: "https://spacenews.com/space-force-tries-to-turn-over-a-new-leaf-in-satellite-procurement/",
                imageUrl: "https://spacenews.com/wp-content/uploads/2022/10/Screen-Shot-2022-10-20-at-8.55.19-AM.png",
                remoteIndex:1
            }
        },
        {
            data: {
                id: 17001,
                title: "Why NASA Is Trying To Crash Land on Mars",
                url: "https://mars.nasa.gov/news/9283/",
                imageUrl: "https://mars.nasa.gov/system/news_items/main_images/9283_1-Illustration-of-SHIELD-web.jpg",
                remoteIndex:2
            }
        }

    ]

    beforeEach(async () => {
        articlesQueue = mock<Queue>();

        const module: TestingModule = await Test.createTestingModule({
            providers: [MSArticlesService,
                { provide: getQueueToken('articles_cache'), useValue: articlesQueue }
            ],
        }).compile();

        service = module.get<MSArticlesService>(MSArticlesService);
    });

    describe('tests for send', () => {

        it('should call addBulk from the queue', async () => {

            await service.send(mockSpaceArticles);

            expect(articlesQueue.addBulk).toBeCalledWith(mockSendArticles)
        })
    })

});
