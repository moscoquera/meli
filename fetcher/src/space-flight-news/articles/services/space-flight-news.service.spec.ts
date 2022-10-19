import { Test, TestingModule } from '@nestjs/testing';
import { SpaceFlightNewsService } from './space-flight-news.service';

describe('SpaceFlightNewsService', () => {
  let service: SpaceFlightNewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpaceFlightNewsService],
    }).compile();

    service = module.get<SpaceFlightNewsService>(SpaceFlightNewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
