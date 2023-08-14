import {Board} from "@/features/boards/model/board.entity";
import {Member, MemberReqPayload, MemberRole} from "@/features/members/model/member.entity";
import {CreateThreadDto} from "@/features/threads/model/create-thread.dto";
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
export class Thread {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  authorName?: string;

  @Column({nullable: true})
  authorRole?: MemberRole;

  @Column({nullable: true})
  password?: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  isHidden: boolean;

  @Column()
  isFixed: boolean;

  @CreateDateColumn({type: "timestamptz"})
  createdAt: Date;

  @UpdateDateColumn({type: "timestamptz"})
  updatedAt: Date;

  @Column({nullable: true})
  authorId?: number;

  @ManyToOne(() => Member, member => member.threads)
  @JoinColumn({name: "authorId"})
  author: Member;

  @Column()
  boardId: string;

  @ManyToOne(() => Board, board => board.threads)
  @JoinColumn({name: "boardId"})
  board: Board;

  constructor(title: string, content: string, isHidden: boolean, isFixed: boolean) {
    this.title = title;
    this.content = content;
    this.isHidden = isHidden;
    this.isFixed = isFixed;
  }

  static fromAuthenticated(boardId: string, createDto: CreateThreadDto, member: MemberReqPayload) {
    const {title, content, isHidden, isFixed} = createDto;
    const thread = new Thread(title, content, isHidden, isFixed);
    thread.boardId = boardId;
    thread.authorId = member.id;
    thread.authorName = member.penName;
    thread.authorRole = member.role;
    return thread;
  }

  static fromUnauthenticated(boardId: string, createDto: CreateThreadDto) {
    const {title, content, isHidden, isFixed, password} = createDto;
    const thread = new Thread(title, content, isHidden, isFixed);
    thread.boardId = boardId;
    thread.password = this.hashPassword(password ?? this.generateDefaultPassword());
    return thread;
  }

  private static hashPassword(password: string): string {
    return createHash("sha256").update(password).digest("hex");
  }

  private static generateDefaultPassword() {
    const date = new Date();
    return `thread-${date.toISOString()}-${date.getTime()}`;
  }

  validatePassword(password: string) {
    return this.password === Thread.hashPassword(password);
  }
}
