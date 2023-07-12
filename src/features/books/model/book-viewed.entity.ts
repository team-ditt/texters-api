import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class BookViewed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bookId: number;

  @CreateDateColumn()
  createdAt: Date;

  constructor(bookId: number) {
    this.bookId = bookId;
  }

  static of(bookId: number) {
    return new BookViewed(bookId);
  }
}
