import {Book, BookStatus} from "@/features/books/model/book.entity";
import {File} from "@/features/files/model/file.entity";
import {Lane} from "@/features/lanes/model/lane.entity";
import {Member} from "@/features/members/model/member.entity";
import {Page} from "@/features/pages/model/page.entity";
import {
  DataSource,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  ViewColumn,
  ViewEntity,
} from "typeorm";

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

  @OneToMany(() => Lane, lane => lane.book)
  lanes: Lane[];

  @OneToMany(() => Page, page => page.book)
  pages: Page[];
}
