import {BookStatus} from "@/features/books/model/book.entity";
import {File} from "@/features/files/model/file.entity";
import {Lane} from "@/features/lanes/model/lane.entity";
import {Member} from "@/features/members/model/member.entity";
import {Page} from "@/features/pages/model/page.entity";
import {
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  ViewColumn,
  ViewEntity,
} from "typeorm";

@ViewEntity({
  expression: `
    WITH viewed_count AS (
      SELECT "bookId", COUNT("bookId")
      FROM book_viewed
      GROUP BY "bookId"
    ), liked_count AS (
      SELECT "bookId", COUNT("bookId")
      FROM book_liked
      GROUP BY "bookId"
    )
    SELECT
      book.*,
      COALESCE(viewed_count.count::integer, 0) AS viewed,
      COALESCE(liked_count.count::integer, 0) AS liked
    FROM
      book LEFT JOIN viewed_count
      ON book.id = viewed_count."bookId"
      LEFT JOIN liked_count
      ON book.id = liked_Count."bookId"
    WHERE
      book."deletedAt" IS NULL
  `,
})
export class BookView {
  @ViewColumn()
  @PrimaryColumn()
  id: number;

  @ViewColumn()
  title: string;

  @ViewColumn()
  description: string;

  @ViewColumn()
  status: BookStatus;

  @ViewColumn()
  createdAt: Date;

  @ViewColumn()
  updatedAt: Date;

  @ViewColumn()
  authorId: number;

  @ViewColumn()
  viewed: number;

  @ViewColumn()
  liked: number;

  @ManyToOne(() => Member, member => member.books)
  @JoinColumn({name: "authorId"})
  author: Member;

  @OneToOne(() => File, file => file.book, {nullable: true})
  @JoinColumn({name: "coverImageId"})
  coverImage: File;

  @OneToMany(() => Lane, lane => lane.book)
  lanes: Lane[];

  @OneToMany(() => Page, page => page.book)
  pages: Page[];

  isPublished() {
    return this.status === "PUBLISHED";
  }
}
