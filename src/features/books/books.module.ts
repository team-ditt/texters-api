import {BookMapper} from "@/features/books/book.mapper";
import {BooksController} from "@/features/books/books.controller";
import {BookFilteredView} from "@/features/books/model/book-filtered-view.entity";
import {Book} from "@/features/books/model/book.entity";
import {MembersModule} from "@/features/members/members.module";
import {SharedModule} from "@/features/shared/shared.module";
import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Book, BookFilteredView]), SharedModule, MembersModule],
  exports: [BookMapper],
  controllers: [BooksController],
  providers: [BookMapper],
})
export class BooksModule {}
