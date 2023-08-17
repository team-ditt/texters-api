import {Choice} from "@/features/choices/model/choice.entity";
import {PublishedPage} from "@/features/published-pages/model/published-page.entity";
import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";

@Entity()
export class PublishedChoice {
  @PrimaryColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  order: number;

  @Column()
  sourcePageId: number;

  @ManyToOne(() => PublishedPage, page => page.choices, {onDelete: "CASCADE"})
  @JoinColumn({name: "sourcePageId"})
  sourcePage: PublishedPage;

  @Column({nullable: true})
  destinationPageId: number;

  @ManyToOne(() => PublishedPage, page => page.sourceChoices, {onDelete: "CASCADE"})
  @JoinColumn({name: "destinationPageId"})
  destinationPage: PublishedPage;

  static from(choice: Choice) {
    const publishedChoice = new PublishedChoice();
    publishedChoice.id = choice.id;
    publishedChoice.content = choice.content;
    publishedChoice.order = choice.order;
    publishedChoice.sourcePageId = choice.sourcePageId;
    publishedChoice.destinationPageId = choice.destinationPageId;
    return publishedChoice;
  }
}
