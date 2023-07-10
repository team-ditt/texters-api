import {Book} from "@/features/books/model/book.entity";
import {File} from "@/features/files/model/file.entity";
import {Member} from "@/features/members/model/member.entity";
import {
  DataSource,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  ViewColumn,
  ViewEntity,
} from "typeorm";

export type BookStatus = "DRAFT" | "PUBLISHED" | "DELETED";

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource.createQueryBuilder().from(Book, "book").where("book.status <> 'DELETED'"),
})
export class BookFilteredView {
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
  modifiedAt: Date;

  @ViewColumn()
  authorId: number;

  @ManyToOne(() => Member, member => member.books)
  @JoinColumn({name: "authorId"})
  author: Member;

  @OneToOne(() => File, file => file.book, {nullable: true})
  @JoinColumn({name: "coverImageId"})
  coverImage: File;
}
