import {Book} from "@/features/books/model/book.entity";
import {Member} from "@/features/members/model/member.entity";
import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class BookLiked {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  memberId: number;

  @ManyToOne(() => Member, member => member.bookLikedRecords, {onDelete: "CASCADE"})
  @JoinColumn({name: "memberId"})
  member: Member;

  @Column()
  bookId: number;

  @ManyToOne(() => Book, book => book.likedRecords, {onDelete: "CASCADE"})
  book: Book;

  constructor(memberId: number, bookId: number) {
    this.memberId = memberId;
    this.bookId = bookId;
  }

  static of(memberId: number, bookId: number) {
    return new BookLiked(memberId, bookId);
  }
}
