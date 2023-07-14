import {Book} from "@/features/books/model/book.entity";
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

  constructor(oauthId: string, penName: string) {
    this.oauthId = oauthId;
    this.penName = penName;
    this.role = "ROLE_USER";
  }

  static of(oauthId: string, penName: string) {
    return new Member(oauthId, penName);
  }
}
