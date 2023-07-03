import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {MemberRole} from "./member-role.type";

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public email: string;

  @Column()
  public penName: string;

  @Column()
  public role: MemberRole;

  @CreateDateColumn({type: "timestamptz"})
  public createdAt: Date;

  @UpdateDateColumn({type: "timestamptz"})
  public modifiedAt: Date;

  constructor(email: string, penName: string) {
    this.email = email;
    this.penName = penName;
    this.role = "ROLE_USER";
  }

  static of(email: string, penName: string) {
    return new Member(email, penName);
  }
}
