import {Member} from "@/features/members/model/member.entity";
import {Thread} from "@/features/threads/model/thread.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class ThreadLiked {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ip: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({nullable: true})
  memberId: number;

  @ManyToOne(() => Member, member => member.threadLikedRecords, {onDelete: "SET NULL"})
  member: Member;

  @Column()
  threadId: number;

  @ManyToOne(() => Thread, thread => thread.likedRecords, {onDelete: "CASCADE"})
  @JoinColumn({name: "threadId"})
  thread: Thread;

  constructor(ip: string, threadId: number, memberId?: number) {
    this.memberId = memberId;
    this.threadId = threadId;
    this.ip = ip;
  }

  static of(ip: string, threadId: number, memberId?: number) {
    return new ThreadLiked(ip, threadId, memberId);
  }
}
