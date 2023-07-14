import {BookView} from "@/features/books/model/book-view.entity";
import {DataSource, ViewEntity} from "typeorm";

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource.createQueryBuilder().from(BookView, "book").where("book.status = 'PUBLISHED'"),
})
export class PublishedBookView extends BookView {}
