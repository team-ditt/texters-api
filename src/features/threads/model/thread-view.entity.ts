import {Member, MemberRole} from "@/features/members/model/member.entity";
import {JoinColumn, ManyToOne, PrimaryColumn, ViewColumn, ViewEntity} from "typeorm";

@ViewEntity({
  expression: `
    WITH liked_count AS (
      SELECT "threadId", COUNT("threadId")
      FROM thread_liked
      GROUP BY "threadId"
    ), comments_count AS (
      SELECT "threadId", COUNT("threadId")
      FROM thread_comment
      GROUP BY "threadId"
    )
    SELECT
      thread.*,
      COALESCE(liked_count.count::integer, 0) AS liked,
      COALESCE(comments_count.count::integer, 0) AS "commentsCount"
    FROM
      thread LEFT JOIN liked_count
      ON thread.id = liked_count."threadId"
      LEFT JOIN comments_count
      ON thread.id = comments_count."threadId"
  `,
})
export class ThreadView {
  @ViewColumn()
  @PrimaryColumn()
  id: number;

  @ViewColumn()
  authorName?: string;

  @ViewColumn()
  authorRole?: MemberRole;

  @ViewColumn()
  password?: string;

  @ViewColumn()
  title: string;

  @ViewColumn()
  content: string;

  @ViewColumn()
  isHidden: boolean;

  @ViewColumn()
  isFixed: boolean;

  @ViewColumn()
  liked: number;

  @ViewColumn()
  commentsCount: number;

  @ViewColumn()
  createdAt: Date;

  @ViewColumn()
  updatedAt: Date;

  @ViewColumn()
  authorId?: number;

  @ManyToOne(() => Member, member => member.threads, {onDelete: "SET NULL"})
  @JoinColumn({name: "authorId"})
  author: Member;

  @ViewColumn()
  boardId: string;
}
