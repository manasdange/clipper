import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Highlights {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    book: string;

    @Column()
    author: string;

    @Column()
    highlight: string;

    @Column({type: 'datetime'})
    addedOn: Date;

    @Column({default: false})
    hidden: boolean;
}