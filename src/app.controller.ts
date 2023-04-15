import { Body, Controller, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { AppService } from './app.service';
import { FetchAuthorsRequestDto, FetchBooksRequestDto, FetchHighlightsRequestDto, UpdateAuthorRequestDto } from './dto/highlights.dto';

@ApiTags('Clipper')
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

  @Get('fetch-highlights')
  async fetchHighlights(@Query() filter: FetchHighlightsRequestDto) {
    return this.appService.fetchHighlights(filter)
  }

  @Get('fetch-authors')
  async fetchAuthors(@Query() request: FetchAuthorsRequestDto) {
    return this.appService.fetchAuthors(request)
  }

  @Get('fetch-books')
  async fetchBooks(@Query() request: FetchBooksRequestDto) {
    return this.appService.fetchBooks(request)
  }

  @Post('update-author')
  async updateAuthor(@Body() request: UpdateAuthorRequestDto){
    await this.appService.updateAuthor(request)
    return "author updated"
  }


}
