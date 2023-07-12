import {Page} from "@/features/pages/model/page.entity";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Choice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  order: number;

  @Column()
  sourcePageId: number;

  @ManyToOne(() => Page, page => page.choices)
  sourcePage: Page;

  @Column({nullable: true})
  destinationPageId: number;

  @ManyToOne(() => Page, page => page.sourceChoices)
  destinationPage: Page;

  constructor(sourcePageId: number, content: string, order: number) {
    this.sourcePageId = sourcePageId;
    this.content = content;
    this.order = order;
  }

  static of(sourcePageId: number, content: string, order: number) {
    return new Choice(sourcePageId, content, order);
  }
}
