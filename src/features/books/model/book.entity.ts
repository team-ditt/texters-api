import {BookComment} from "@/features/book-comments/model/book-comment.entity";
import {BookLiked} from "@/features/book-liked/model/book-liked.entity";
import {BookViewed} from "@/features/books/model/book-viewed.entity";
import {File} from "@/features/files/model/file.entity";
import {Lane} from "@/features/lanes/model/lane.entity";
import {Member} from "@/features/members/model/member.entity";
import {Page} from "@/features/pages/model/page.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @CreateDateColumn({type: "timestamptz"})
  createdAt: Date;

  @UpdateDateColumn({type: "timestamptz"})
  updatedAt: Date;

  @Column()
  authorId: number;

  @ManyToOne(() => Member, member => member.books)
  @JoinColumn({name: "authorId"})
  author: Member;

  @Column({nullable: true})
  coverImageId: string;

  @OneToOne(() => File, file => file.book, {nullable: true, onDelete: "CASCADE"})
  @JoinColumn({name: "coverImageId"})
  coverImage: File;

  @OneToMany(() => Lane, lane => lane.book)
  lanes: Lane[];

  @OneToMany(() => Page, page => page.book)
  pages: Page[];

  @OneToMany(() => BookViewed, viewed => viewed.book)
  viewedRecords: BookViewed[];

  @OneToMany(() => BookLiked, liked => liked.book)
  likedRecords: BookLiked[];

  @OneToMany(() => BookComment, comment => comment.book)
  comments: BookComment[];

  constructor(title: string, description: string) {
    this.title = title;
    this.description = description;
  }

  static of(title: string, description: string) {
    return new Book(title, description);
  }
}
