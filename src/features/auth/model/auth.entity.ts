import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class Auth {
  @PrimaryColumn()
  id: number;

  @Column()
  refreshToken: string;

  constructor(id: number, refreshToken: string) {
    this.id = id;
    this.refreshToken = refreshToken;
  }

  static of(id: number, refreshToken: string) {
    return new Auth(id, refreshToken);
  }
}
