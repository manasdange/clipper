import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { Highlights } from './highlights.entity';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm'

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
    console.log("username", username.username)


    
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

    //console.log(records)

    const entries = this.highlightsRepository.create(records)
    entries.shift()
    console.log(entries[0])

    this.highlightsRepository.save(entries)

    const count = entries.length

    return(`${count} highlights added`)

  }
}
