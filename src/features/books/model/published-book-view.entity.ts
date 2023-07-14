import {FilteredBookView} from "@/features/books/model/filtered-book-view.entity";
import {DataSource, ViewEntity} from "typeorm";

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .from(FilteredBookView, "book")
      .where("book.status = 'PUBLISHED'"),
})
export class PublishedBookView extends FilteredBookView {}
