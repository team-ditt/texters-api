import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {MemberRole} from "./member-role.type";

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public oauthId: string;

  @Column()
  public penName: string;

  @Column()
  public role: MemberRole;

  @CreateDateColumn({type: "timestamptz"})
  public createdAt: Date;

  @UpdateDateColumn({type: "timestamptz"})
  public modifiedAt: Date;

  constructor(oauthId: string, penName: string) {
    this.oauthId = oauthId;
    this.penName = penName;
    this.role = "ROLE_USER";
  }

  static of(oauthId: string, penName: string) {
    return new Member(oauthId, penName);
  }
}
