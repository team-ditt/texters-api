import {Thread} from "@/features/threads/model/thread.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

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

  @OneToMany(() => Thread, thread => thread.board)
  threads: Thread[];

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  static of(id: string, name: string) {
    return new Board(id, name);
  }
}
