import {MemberRole} from "@/types";
import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  penName: string;

  @Column()
  role: MemberRole;

  @CreateDateColumn({type: "timestamptz"})
  createdAt: Date;

  @UpdateDateColumn({type: "timestamptz"})
  modifiedAt: Date;
}
