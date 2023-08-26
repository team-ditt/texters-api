import {PublishedBook} from "@/features/published-books/model/published-book.entity";
import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn} from "typeorm";

@Entity()
export class PublishedBookTitleSearch {
  @PrimaryColumn()
  id: number;

  @Column()
  index: string;

  @OneToOne(() => PublishedBook, book => book.titleIndex, {onDelete: "CASCADE"})
  @JoinColumn({name: "id"})
  publishedBook: PublishedBook;

  constructor(id: number, index: string) {
    this.id = id;
    this.index = index;
  }

  static of(id: number, index: string) {
    return new PublishedBookTitleSearch(id, index);
  }
}
