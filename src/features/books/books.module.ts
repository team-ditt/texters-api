import {BookMapper} from "@/features/books/book.mapper";
import {BooksController} from "@/features/books/books.controller";
import {MembersModule} from "@/features/members/members.module";
import {SharedModule} from "@/features/shared/shared.module";
import {Module} from "@nestjs/common";

@Module({
  imports: [SharedModule, MembersModule],
  controllers: [BooksController],
  providers: [BookMapper],
})
export class BooksModule {}
