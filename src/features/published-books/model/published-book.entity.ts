import {Book} from "@/features/books/model/book.entity";
import {File} from "@/features/files/model/file.entity";
import {Member} from "@/features/members/model/member.entity";
import {PublishedBookTitleSearch} from "@/features/published-books/model/published-book-title-index.entity";
import {PublishedPage} from "@/features/published-pages/model/published-page.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from "typeorm";

@Entity()
export class PublishedBook {
  @PrimaryColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @CreateDateColumn({type: "timestamptz"})
  publishedAt: Date;

  @Column()
  authorId: number;

  @ManyToOne(() => Member, member => member.publishedBooks, {createForeignKeyConstraints: false})
  @JoinColumn({name: "authorId"})
  author: Member;

  @Column({nullable: true})
  coverImageId: string;

  @OneToOne(() => File, file => file.publishedBook, {createForeignKeyConstraints: false})
  @JoinColumn({name: "coverImageId"})
  coverImage: File;

  @OneToMany(() => PublishedPage, page => page.book, {cascade: ["insert"]})
  pages: PublishedPage[];

  @OneToOne(() => PublishedBookTitleSearch, search => search.publishedBook)
  titleIndex: PublishedBookTitleSearch;

  static from(book: Book) {
    const publishedBook = new PublishedBook();
    publishedBook.id = book.id;
    publishedBook.title = book.title;
    publishedBook.description = book.description;
    publishedBook.authorId = book.authorId;
    publishedBook.coverImageId = book.coverImageId;
    publishedBook.pages = book.lanes.flatMap(lane =>
      lane.pages.map(page => {
        const isIntro = lane.order === 0;
        const isEnding = page.choices.length === 0;
        return PublishedPage.from(page, isIntro, isEnding);
      }),
    );
    return publishedBook;
  }
}
