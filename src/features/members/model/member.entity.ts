import {BookComment} from "@/features/book-comments/model/book-comment.entity";
import {Book} from "@/features/books/model/book.entity";
import {ThreadComment} from "@/features/thread-comments/model/thread-comment.entity";
import {ThreadLiked} from "@/features/thread-liked/model/thread-liked.entity";
import {Thread} from "@/features/threads/model/thread.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export type MemberRole = "ROLE_USER" | "ROLE_ADMIN";

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  oauthId: string;

  @Column()
  penName: string;

  @Column()
  role: MemberRole;

  @CreateDateColumn({type: "timestamptz"})
  createdAt: Date;

  @UpdateDateColumn({type: "timestamptz"})
  updatedAt: Date;

  @OneToMany(() => Book, book => book.author)
  books: Book[];

  @OneToMany(() => BookComment, comment => comment.book)
  bookComments: BookComment[];

  @OneToMany(() => Thread, thread => thread.author)
  threads: Thread[];

  @OneToMany(() => ThreadComment, comment => comment)
  threadComments: ThreadComment[];

  @OneToMany(() => ThreadLiked, threadLiked => threadLiked.member)
  threadLikedRecords: ThreadLiked[];

  constructor(oauthId: string, penName: string) {
    this.oauthId = oauthId;
    this.penName = penName;
    this.role = "ROLE_USER";
  }

  static of(oauthId: string, penName: string) {
    return new Member(oauthId, penName);
  }
}

export type MemberReqPayload = Pick<Member, "id" | "role" | "penName">;
