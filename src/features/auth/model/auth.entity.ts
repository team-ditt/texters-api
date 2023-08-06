import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  memberId: number;

  @Column()
  refreshToken: string;

  @CreateDateColumn({type: "timestamptz"})
  createdAt: Date;

  constructor(memberId: number, refreshToken: string) {
    this.memberId = memberId;
    this.refreshToken = refreshToken;
  }

  static of(memberId: number, refreshToken: string) {
    return new Auth(memberId, refreshToken);
  }
}
