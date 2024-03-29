import {Book} from "@/features/books/model/book.entity";
import {PublishedBook} from "@/features/published-books/model/published-book.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class File {
  readonly S3_BUCKET_PUBLIC_URL = "https://texters.s3.ap-northeast-2.amazonaws.com";

  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column()
  directory: string;

  @Column()
  extension: string;

  @CreateDateColumn({type: "timestamptz"})
  createdAt: Date;

  @UpdateDateColumn({type: "timestamptz"})
  updatedAt: Date;

  @OneToOne(() => Book, book => book.coverImage)
  book: Book;

  @OneToOne(() => PublishedBook, book => book.coverImage)
  publishedBook: PublishedBook;

  constructor(directory: string, extension: string) {
    this.directory = directory;
    this.extension = extension;
  }

  static of(directory: string, extension: string) {
    return new File(directory, extension);
  }

  static toUrl({uuid, directory, extension}: File) {
    const file = new File(directory, extension);
    file.uuid = uuid;
    return file.toUrl();
  }

  toUrl(): string {
    return `${this.S3_BUCKET_PUBLIC_URL}/${this.directory}/${this.uuid}.${this.extension}`;
  }
}
