import {PrimaryColumn, ViewColumn, ViewEntity} from "typeorm";

@ViewEntity({
  expression: `
    WITH viewed_count AS (
      SELECT "bookId", COUNT("bookId")
      FROM book_viewed
      GROUP BY "bookId"
    ), liked_count AS (
      SELECT "bookId", COUNT("bookId")
      FROM book_liked
      GROUP BY "bookId"
    ), comments_count AS (
      SELECT "bookId", COUNT("bookId")
      FROM book_comment
      GROUP BY "bookId"
    )
    SELECT
      book.id,
      COALESCE(viewed_count.count::integer, 0) AS viewed,
      COALESCE(liked_count.count::integer, 0) AS liked,
      COALESCE(comments_count.count::integer, 0) AS "commentsCount"
    FROM
      book LEFT JOIN viewed_count
      ON book.id = viewed_count."bookId"
      LEFT JOIN liked_count
      ON book.id = liked_count."bookId"
      LEFT JOIN comments_count
      ON book.id = comments_count."bookId"
  `,
})
export class BookStatisticsView {
  @ViewColumn()
  @PrimaryColumn()
  id: number;

  @ViewColumn()
  viewed: number;

  @ViewColumn()
  liked: number;

  @ViewColumn()
  commentsCount: number;
}
