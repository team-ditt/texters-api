import {Book} from "@/features/books/model/book.entity";
import {Lane} from "@/features/lanes/model/lane.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Page {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({nullable: true})
  content: string | null;

  @Column()
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;

  @Column()
  bookId: number;

  @ManyToOne(() => Book, book => book.pages)
  @JoinColumn({name: "bookId"})
  book: Book;

  @Column()
  laneId: number;

  @ManyToOne(() => Lane, lane => lane.pages)
  @JoinColumn({name: "laneId"})
  lane: Lane;

  constructor(bookId: number, laneId: number, title: string, order: number) {
    this.bookId = bookId;
    this.laneId = laneId;
    this.title = title;
    this.order = order;
  }

  static of(bookId: number, laneId: number, title: string, order: number) {
    return new Page(bookId, laneId, title, order);
  }
}