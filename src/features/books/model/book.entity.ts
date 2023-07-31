import {File} from "@/features/files/model/file.entity";
import {Lane} from "@/features/lanes/model/lane.entity";
import {Member} from "@/features/members/model/member.entity";
import {Page} from "@/features/pages/model/page.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export type BookStatus = "DRAFT" | "PUBLISHED";

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: BookStatus;

  @CreateDateColumn({type: "timestamptz"})
  createdAt: Date;

  @UpdateDateColumn({type: "timestamptz"})
  updatedAt: Date;

  @DeleteDateColumn({type: "timestamptz"})
  deletedAt?: Date;

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

  constructor(title: string, description: string) {
    this.title = title;
    this.description = description;
    this.status = "DRAFT";
  }

  static of(title: string, description: string) {
    return new Book(title, description);
  }

  isPublished() {
    return this.status === "PUBLISHED";
  }
}
