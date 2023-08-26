import {Book} from "@/features/books/model/book.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class BookViewed {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({type: "timestamptz"})
  createdAt: Date;

  @Column()
  bookId: number;

  @ManyToOne(() => Book, book => book.viewedRecords, {onDelete: "CASCADE"})
  @JoinColumn({name: "bookId"})
  book: Book;

  constructor(bookId: number) {
    this.bookId = bookId;
  }

  static of(bookId: number) {
    return new BookViewed(bookId);
  }
}
