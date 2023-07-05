import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class Auth {
  @PrimaryColumn()
  public id: number;

  @Column()
  public refreshToken: string;

  constructor(id: number, refreshToken: string) {
    this.id = id;
    this.refreshToken = refreshToken;
  }

  static of(id: number, refreshToken: string) {
    return new Auth(id, refreshToken);
  }
}
