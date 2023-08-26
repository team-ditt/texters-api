import {PublishedBookMapper} from "@/features/published-books/published-book.mapper";
import {SharedModule} from "@/features/shared/shared.module";
import {Module} from "@nestjs/common";
import {PublishedBooksController} from "./published-books.controller";

@Module({
  imports: [SharedModule],
  controllers: [PublishedBooksController],
  providers: [PublishedBookMapper],
})
export class PublishedBooksModule {}
