import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,
    {
      transport: Transport.TCP,
      options:{
        host:'::',
        port:8881,
        retryAttempts:3,
        retryDelay: 1000
      }
    });
  await app.listen();
}
bootstrap();
