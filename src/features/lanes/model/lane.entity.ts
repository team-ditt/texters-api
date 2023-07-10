import {Book} from "@/features/books/model/book.entity";
import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Lane {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order: number;

  @Column()
  bookId: number;

  @ManyToOne(() => Book, book => book.lanes)
  @JoinColumn({name: "bookId"})
  book: Book;

  constructor(bookId: number, order: number) {
    this.bookId = bookId;
    this.order = order;
  }

  static of(bookId: number, order: number) {
    return new Lane(bookId, order);
  }
}
