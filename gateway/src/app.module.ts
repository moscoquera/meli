import { Module } from '@nestjs/common';
import { ArticlesModule } from './articles/articles.module';
import {ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  imports: [
    ClientsModule.register([
      {
        name:'ms-articles',
        transport:Transport.TCP,
        options:{
           host: 'ms-articles',
           port: 8881,
        }
      }
    ])
    ,ArticlesModule],
})
export class AppModule {}
