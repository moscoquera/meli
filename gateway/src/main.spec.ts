import { NestFactory } from '@nestjs/core';
import { bootstrap } from './main';

jest.mock('@nestjs/core', () => {
  return _mockNest();
});

describe('Main file', () => {
  describe('bootstrap', () => {
    let app;
    afterEach(async () => {
      if (app) app.close();
    });

    it('should create new nest application', async () => {
      const spy = jest.spyOn(NestFactory, 'create');

      try {
        app = await bootstrap();
      } catch (e) {}

      expect(spy).toBeCalled();

      spy.mockRestore();
    });
  });
});

function _mockNest() {
  return {
    __esModule: true,
    NestFactory: {
      create: jest.fn().mockResolvedValue({
        listen: jest.fn().mockResolvedValue(1),
      }),
    },
  };
}
