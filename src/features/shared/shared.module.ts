import {BooksService} from "@/features/books/books.service";
import {BookFilteredView} from "@/features/books/model/book-filtered-view.entity";
import {Book} from "@/features/books/model/book.entity";
import {FilesService} from "@/features/files/files.service";
import {File} from "@/features/files/model/file.entity";
import {LanesService} from "@/features/lanes/lanes.service";
import {Lane} from "@/features/lanes/model/lane.entity";
import {Page} from "@/features/pages/model/page.entity";
import {PagesService} from "@/features/pages/pages.service";
import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([File, Book, BookFilteredView, Lane, Page])],
  exports: [FilesService, BooksService, LanesService, PagesService],
  providers: [FilesService, BooksService, LanesService, PagesService],
})
export class SharedModule {}