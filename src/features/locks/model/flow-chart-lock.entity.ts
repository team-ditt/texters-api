import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class FlowChartLock {
  @PrimaryColumn()
  id: number;

  @Column()
  key: string;

  constructor(id: number, key: string) {
    this.id = id;
    this.key = key;
  }

  static of(id: number, key: string) {
    return new FlowChartLock(id, key);
  }
}
