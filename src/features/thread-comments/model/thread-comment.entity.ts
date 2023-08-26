import {Member, MemberReqPayload, MemberRole} from "@/features/members/model/member.entity";
import {Thread} from "@/features/threads/model/thread.entity";
import {createHash} from "crypto";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class ThreadComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  commenterName?: string;

  @Column({nullable: true})
  commenterRole?: MemberRole;

  @Column({nullable: true})
  password?: string;

  @Column()
  content: string;

  @CreateDateColumn({type: "timestamptz"})
  createdAt: Date;

  @UpdateDateColumn({type: "timestamptz"})
  updatedAt: Date;

  @Column({nullable: true})
  commenterId?: number;

  @ManyToOne(() => Member, member => member.threadComments, {onDelete: "SET NULL"})
  @JoinColumn({name: "commenterId"})
  commenter: Member;

  @Column()
  threadId: number;

  @ManyToOne(() => Thread, thread => thread.comments, {onDelete: "CASCADE"})
  @JoinColumn({name: "threadId"})
  thread: Thread;

  constructor(threadId: number, content: string) {
    this.threadId = threadId;
    this.content = content;
  }

  static fromAuthenticated(threadId: number, content: string, member: MemberReqPayload) {
    const comment = new ThreadComment(threadId, content);
    comment.commenterId = member.id;
    comment.commenterName = member.penName;
    comment.commenterRole = member.role;
    return comment;
  }

  static fromUnauthenticated(threadId: number, content: string, password: string) {
    const comment = new ThreadComment(threadId, content);
    comment.password = this.hashPassword(password ?? this.generateDefaultPassword());
    return comment;
  }

  private static hashPassword(password: string): string {
    return createHash("sha256").update(password).digest("hex");
  }

  private static generateDefaultPassword() {
    const date = new Date();
    return `thread-${date.toISOString()}-${date.getTime()}`;
  }

  validatePassword(password: string) {
    return this.password === ThreadComment.hashPassword(password);
  }
}
