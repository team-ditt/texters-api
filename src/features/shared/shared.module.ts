import {BookLiked} from "@/features/book-liked/model/book-liked.entity";
import {BooksService} from "@/features/books/books.service";
import {BookTitleSearch} from "@/features/books/model/book-title-index.entity";
import {BookViewed} from "@/features/books/model/book-viewed.entity";
import {Book} from "@/features/books/model/book.entity";
import {FilteredBookView} from "@/features/books/model/filtered-book-view.entity";
import {PublishedBookView} from "@/features/books/model/published-book-view.entity";
import {ChoicesService} from "@/features/choices/choices.service";
import {Choice} from "@/features/choices/model/choice.entity";
import {FilesService} from "@/features/files/files.service";
import {File} from "@/features/files/model/file.entity";
import {LanesService} from "@/features/lanes/lanes.service";
import {Lane} from "@/features/lanes/model/lane.entity";
import {LocksService} from "@/features/locks/locks.service";
import {FlowChartLock} from "@/features/locks/model/flow-chart-lock.entity";
import {Page} from "@/features/pages/model/page.entity";
import {PagesService} from "@/features/pages/pages.service";
import {PaginationMapper} from "@/features/shared/pagination.mapper";
import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      File,
      Book,
      FilteredBookView,
      PublishedBookView,
      BookTitleSearch,
      BookViewed,
      BookLiked,
      Lane,
      Page,
      Choice,
      FlowChartLock,
    ]),
  ],
  exports: [
    PaginationMapper,
    FilesService,
    BooksService,
    LanesService,
    PagesService,
    ChoicesService,
    LocksService,
  ],
  providers: [
    PaginationMapper,
    FilesService,
    BooksService,
    LanesService,
    PagesService,
    ChoicesService,
    LocksService,
  ],
})
export class SharedModule {}
