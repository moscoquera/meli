import { Test, TestingModule } from '@nestjs/testing';
import { SpaceFlightNewsController } from './space-flight-news.controller';
import { SpaceFlightNewsService } from './services/space-flight-news.service';
import { MockProxy, mock } from 'jest-mock-extended';


describe('SpaceFlightNewsController', () => {
  let controller: SpaceFlightNewsController;
  let mockService: MockProxy<SpaceFlightNewsService>; 

  beforeEach(async () => {
    mockService = mock<SpaceFlightNewsService>();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpaceFlightNewsController],
      providers: [{
        provide:SpaceFlightNewsService,
        useValue: mockService
      }
      ],
    }).compile();

    controller = module.get<SpaceFlightNewsController>(
      SpaceFlightNewsController,
    );
  });

  it('should call list method from service', async () => {
    mockService.list.mockResolvedValue([]);
    await controller.list({page: 2, size: 10});
    expect(mockService.listOrSchedule).toBeCalledWith(2,10);
  });

  it('should call count method from service', async () => {
    mockService.list.mockResolvedValue([]);
    await controller.count();
    expect(mockService.count).toBeCalled();
  });
});
