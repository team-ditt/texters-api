import {Member} from "@/features/members/model/member.entity";
import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  refreshToken: string;

  @CreateDateColumn({type: "timestamptz"})
  createdAt: Date;

  @Column()
  memberId: number;

  @ManyToOne(() => Member, member => member.authTokens, {onDelete: "CASCADE"})
  member: Member;

  constructor(memberId: number, refreshToken: string) {
    this.memberId = memberId;
    this.refreshToken = refreshToken;
  }

  static of(memberId: number, refreshToken: string) {
    return new Auth(memberId, refreshToken);
  }
}
