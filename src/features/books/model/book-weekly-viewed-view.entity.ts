import {ViewColumn, ViewEntity} from "typeorm";

@ViewEntity({
  expression: `
    SELECT "bookId" AS id, COUNT("bookId") AS viewed
    FROM book_viewed
    WHERE "createdAt" BETWEEN CURRENT_TIMESTAMP - INTERVAL '7 days' AND CURRENT_TIMESTAMP
    GROUP BY "bookId"
  `,
})
export class BookWeeklyViewedView {
  @ViewColumn()
  id: number;

  @ViewColumn()
  viewed: number;
}
