import { Test, TestingModule } from '@nestjs/testing';
import { SpaceFlightNewsController } from './space-flight-news.controller';
import { SpaceFlightNewsService } from './services/space-flight-news.service';

describe('SpaceFlightNewsController', () => {
  let controller: SpaceFlightNewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpaceFlightNewsController],
      providers: [SpaceFlightNewsService],
    }).compile();

    controller = module.get<SpaceFlightNewsController>(
      SpaceFlightNewsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
