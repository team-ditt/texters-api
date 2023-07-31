import {Book} from "@/features/books/model/book.entity";
import {Choice} from "@/features/choices/model/choice.entity";
import {Lane} from "@/features/lanes/model/lane.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
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

  @CreateDateColumn({type: "timestamptz"})
  createdAt: Date;

  @UpdateDateColumn({type: "timestamptz"})
  updatedAt: Date;

  @Column()
  bookId: number;

  @ManyToOne(() => Book, book => book.pages, {onDelete: "CASCADE"})
  @JoinColumn({name: "bookId"})
  book: Book;

  @Column()
  laneId: number;

  @ManyToOne(() => Lane, lane => lane.pages, {onDelete: "CASCADE"})
  @JoinColumn({name: "laneId"})
  lane: Lane;

  @OneToMany(() => Choice, choice => choice.sourcePage)
  choices: Choice[];

  @OneToMany(() => Choice, choice => choice.destinationPage)
  sourceChoices: Choice[];

  constructor(bookId: number, laneId: number, title: string, order: number) {
    this.bookId = bookId;
    this.laneId = laneId;
    this.title = title;
    this.order = order;
  }

  static of(bookId: number, laneId: number, title: string, order: number) {
    return new Page(bookId, laneId, title, order);
  }

  isIntro() {
    return this.lane.isIntro() && this.order === 0;
  }
}
