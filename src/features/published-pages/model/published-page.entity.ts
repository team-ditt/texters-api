import {Page} from "@/features/pages/model/page.entity";
import {PublishedBook} from "@/features/published-books/model/published-book.entity";
import {PublishedChoice} from "@/features/published-pages/model/published-choice.entity";
import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";

@Entity()
export class PublishedPage {
  @PrimaryColumn()
  id: number;

  @Column()
  title: string;

  @Column({nullable: true})
  content: string | null;

  @Column()
  isIntro: boolean;

  @Column()
  isEnding: boolean;

  @Column()
  bookId: number;

  @ManyToOne(() => PublishedBook, book => book.pages, {onDelete: "CASCADE"})
  @JoinColumn({name: "bookId"})
  book: PublishedBook;

  @OneToMany(() => PublishedChoice, choice => choice.sourcePage, {cascade: ["insert"]})
  choices: PublishedChoice[];

  @OneToMany(() => PublishedChoice, choice => choice.destinationPage)
  sourceChoices: PublishedChoice[];

  static from(page: Page, isEnding: boolean) {
    const publishedPage = new PublishedPage();
    publishedPage.id = page.id;
    publishedPage.title = page.title;
    publishedPage.content = page.content;
    publishedPage.isIntro = page.isIntro;
    publishedPage.isEnding = isEnding;
    publishedPage.choices = page.choices.map(choice => PublishedChoice.from(choice));
    return publishedPage;
  }
}
