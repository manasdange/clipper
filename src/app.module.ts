import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import {TypeOrmModule} from '@nestjs/typeorm'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Highlights } from './highlights.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'db.sqlite',
    entities: [Highlights],
    synchronize: true
  }),
  TypeOrmModule.forFeature([Highlights])
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
