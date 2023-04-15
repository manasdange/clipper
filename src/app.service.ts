import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { Highlights } from './highlights.entity';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm'
import { FetchAuthorsRequestDto, FetchBooksRequestDto, FetchHighlightsRequestDto, UpdateAuthorRequestDto } from './dto/highlights.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Highlights)
    private highlightsRepository: Repository<Highlights>
  ){}
  getHello(): string {
    return 'Hello World!';
  }


  async parseFile(file, username){
    const content = fs.readFileSync(file.path, 'utf-8')
    const arr = content.split('==========')
    arr.pop()

    let records = [];
    arr.map(ele => {
      let record = {};
      const item = ele.split('\r\n')
      const line1 = item[1]
      const authorindex = line1.lastIndexOf('(')
      const title = line1.slice(0,authorindex).trim()
      const author = line1.slice(authorindex+1, line1.length-1)
      const line2 = item[2]
      const time = line2.slice(line2.indexOf("Added on ")+9)
      const addedOn = new Date(time)
      
      record['username'] = username.username;
      record['book'] = title;
      record['author'] = author;
      record['highlight'] = item[4]
      record['addedOn'] = addedOn;

      records.push(record)
    })

    const entries = this.highlightsRepository.create(records)
    entries.shift()

    return await this.handleDb(entries, username)

  }

  async handleDb(entries: Highlights[], username) {

    const countInDb = await this.highlightsRepository.count({where: username})
    console.log(countInDb)
    if(countInDb){
      this.highlightsRepository.save(entries.slice(countInDb))
      return(`${entries.length - countInDb} highlights added`)
    }
    else{
      this.highlightsRepository.save(entries)
      return(`${entries.length} highlights added`)
    }
  }

  async fetchHighlights(filter: FetchHighlightsRequestDto) {
    const filteredData = await this.highlightsRepository.find({where: {...filter, hidden: false}})
    
    return {count: filteredData.length, data: filteredData}
  }

  async fetchAuthors(request: FetchAuthorsRequestDto) {
    const authors = await this.highlightsRepository.createQueryBuilder('highlights')
    .select(['author'])
    .distinct()
    .getRawMany()
    return {count: authors.length, authors}
  }

  async fetchBooks(request: FetchBooksRequestDto) {
    if(!request.author) {
      const books = await this.highlightsRepository.createQueryBuilder('highlights')
      .select(['book', 'author'])
      .distinct()
      .getRawMany()
      return {count: books.length, books};
    } else {
      const books = await this.highlightsRepository.createQueryBuilder('highlights')
      .select(['book', 'author'])
      .where('author = :author', {author: request.author})
      .distinct()
      .getRawMany()
      return {count: books.length, books};
    }
  }

  async updateAuthor(request: UpdateAuthorRequestDto) {
    //const updates = await this.highlightsRepository.find({where: {username: request.username, author: request.currentName}});
    await this.highlightsRepository.update({username: request.username, author: request.currentName}, {author: request.updatedName})
  }

}
