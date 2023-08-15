import {Book} from "@/features/books/model/book.entity";
import {Member} from "@/features/members/model/member.entity";
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
export class BookComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  commenterName: string;

  @Column()
  commenterRole: string;

  @Column()
  isSpoiler: boolean;

  @Column()
  content: string;

  @CreateDateColumn({type: "timestamptz"})
  createdAt: Date;

  @UpdateDateColumn({type: "timestamptz"})
  updatedAt: Date;

  @Column()
  bookId: number;

  @ManyToOne(() => Book, book => book.pages, {onDelete: "CASCADE"})
  @JoinColumn({name: "bookId"})
  book: Book;

  @Column({nullable: true})
  commenterId: number;

  @ManyToOne(() => Member, member => member.bookComments, {onDelete: "SET NULL"})
  @JoinColumn({name: "commenterId"})
  commenter: Member;

  constructor(
    bookId: number,
    commenterId: number,
    commenterName: string,
    commenterRole: string,
    isSpoiler: boolean,
    content: string,
  ) {
    this.bookId = bookId;
    this.commenterId = commenterId;
    this.commenterName = commenterName;
    this.commenterRole = commenterRole;
    this.isSpoiler = isSpoiler;
    this.content = content;
  }

  static of(
    bookId: number,
    commenterId: number,
    commenterName: string,
    commenterRole: string,
    isSpoiler: boolean,
    content: string,
  ) {
    return new BookComment(bookId, commenterId, commenterName, commenterRole, isSpoiler, content);
  }
}
