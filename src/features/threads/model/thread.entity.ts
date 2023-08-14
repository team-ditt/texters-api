import {Board} from "@/features/boards/model/board.entity";
import {Member, MemberRole} from "@/features/members/model/member.entity";
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

  @ManyToOne(() => Board, board => board.threads)
  board: Board;

  constructor(title: string, content: string, isHidden: boolean, isFixed: boolean) {
    this.title = title;
    this.content = content;
    this.isHidden = isHidden;
    this.isFixed = isFixed;
  }

  static fromAuthenticated(
    createDto: CreateThreadDto,
    member: Pick<Member, "id" | "role" | "penName">,
  ) {
    const {title, content, isHidden, isFixed} = createDto;
    const thread = new Thread(title, content, isHidden, isFixed);
    thread.authorId = member.id;
    thread.authorName = member.penName;
    thread.authorRole = member.role;
    return thread;
  }

  static fromUnauthenticated(createDto: CreateThreadDto) {
    const {title, content, isHidden, isFixed, password} = createDto;
    const thread = new Thread(title, content, isHidden, isFixed);
    thread.password = this.hashPassword(password ?? this.generateDefaultPassword());
    return thread;
  }

  static hashPassword(password: string): string {
    return createHash("sha256").update(password).digest("hex");
  }

  private static generateDefaultPassword() {
    const date = new Date();
    return `thread-${date.toUTCString()}-${date.getTime()}`;
  }
}
