import {Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class Board {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @CreateDateColumn({type: "timestamptz"})
  createdAt: Date;

  @UpdateDateColumn({type: "timestamptz"})
  updatedAt: Date;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  static of(id: string, name: string) {
    return new Board(id, name);
  }
}
