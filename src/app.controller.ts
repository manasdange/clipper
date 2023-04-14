import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AppService } from './app.service';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload-clippings')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename:  (req, file, callback) => {
        const filename = 'clip'+Date.now()+'.txt'
        callback(null, filename)
      }
    })
  }))
  async uploadClippings(@UploadedFile() file: Express.Multer.File, @Body() username) {
    return await this.appService.parseFile(file, username)
  }
}
