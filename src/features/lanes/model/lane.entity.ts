import {Book} from "@/features/books/model/book.entity";
import {Page} from "@/features/pages/model/page.entity";
import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";

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

  @OneToMany(() => Page, page => page.lane)
  pages: Page[];

  constructor(bookId: number, order: number) {
    this.bookId = bookId;
    this.order = order;
  }

  static of(bookId: number, order: number) {
    return new Lane(bookId, order);
  }

  isIntro() {
    return this.order === 0;
  }
}
