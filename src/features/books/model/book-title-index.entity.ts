import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class BookTitleSearch {
  @PrimaryColumn()
  id: number;

  @Column()
  index: string;

  constructor(id: number, index: string) {
    this.id = id;
    this.index = index;
  }

  static of(id: number, index: string) {
    return new BookTitleSearch(id, index);
  }
}
