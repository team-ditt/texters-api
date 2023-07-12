import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class BookLiked {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  memberId: number;

  @Column()
  bookId: number;

  constructor(memberId: number, bookId: number) {
    this.memberId = memberId;
    this.bookId = bookId;
  }

  static of(memberId: number, bookId: number) {
    return new BookLiked(memberId, bookId);
  }
}
