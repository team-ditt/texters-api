import {BookMapper} from "@/features/books/book.mapper";
import {BooksController} from "@/features/books/books.controller";
import {BooksService} from "@/features/books/books.service";
import {BookFilteredView} from "@/features/books/model/book-filtered-view.entity";
import {Book} from "@/features/books/model/book.entity";
import {FilesModule} from "@/features/files/files.module";
import {MembersModule} from "@/features/members/members.module";
import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Book, BookFilteredView]), MembersModule, FilesModule],
  exports: [BookMapper],
  controllers: [BooksController],
  providers: [BooksService, BookMapper],
})
export class BooksModule {}
