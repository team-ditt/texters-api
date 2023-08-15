import {AuthService} from "@/features/auth/auth.service";
import {Auth} from "@/features/auth/model/auth.entity";
import {BoardsService} from "@/features/boards/boards.service";
import {Board} from "@/features/boards/model/board.entity";
import {BookCommentsService} from "@/features/book-comments/book-comments.service";
import {BookComment} from "@/features/book-comments/model/book-comment.entity";
import {BookLikedService} from "@/features/book-liked/book-liked.service";
import {BookLiked} from "@/features/book-liked/model/book-liked.entity";
import {BooksService} from "@/features/books/books.service";
import {BookTitleSearch} from "@/features/books/model/book-title-index.entity";
import {BookView} from "@/features/books/model/book-view.entity";
import {BookViewed} from "@/features/books/model/book-viewed.entity";
import {BookWeeklyViewedView} from "@/features/books/model/book-weekly-viewed-view.entity";
import {Book} from "@/features/books/model/book.entity";
import {PublishedBookView} from "@/features/books/model/published-book-view.entity";
import {ChoicesService} from "@/features/choices/choices.service";
import {Choice} from "@/features/choices/model/choice.entity";
import {FilesService} from "@/features/files/files.service";
import {File} from "@/features/files/model/file.entity";
import {LanesService} from "@/features/lanes/lanes.service";
import {Lane} from "@/features/lanes/model/lane.entity";
import {LocksService} from "@/features/locks/locks.service";
import {FlowChartLock} from "@/features/locks/model/flow-chart-lock.entity";
import {MemberMapper} from "@/features/members/member.mapper";
import {MembersService} from "@/features/members/members.service";
import {Member} from "@/features/members/model/member.entity";
import {Page} from "@/features/pages/model/page.entity";
import {PagesService} from "@/features/pages/pages.service";
import {PaginationMapper} from "@/features/shared/pagination.mapper";
import {ThreadComment} from "@/features/thread-comments/model/thread-comment.entity";
import {ThreadCommentsService} from "@/features/thread-comments/thread-comments.service";
import {ThreadLiked} from "@/features/thread-liked/model/thread-liked.entity";
import {ThreadLikedService} from "@/features/thread-liked/thread-liked.service";
import {ThreadView} from "@/features/threads/model/thread-view.entity";
import {Thread} from "@/features/threads/model/thread.entity";
import {ThreadsService} from "@/features/threads/threads.service";
import {HttpModule} from "@nestjs/axios";
import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {expiresIn: "1h"},
      }),
    }),
    HttpModule,
    TypeOrmModule.forFeature([
      Auth,
      Member,
      File,
      Book,
      BookView,
      PublishedBookView,
      BookTitleSearch,
      BookViewed,
      BookLiked,
      BookWeeklyViewedView,
      BookLiked,
      Lane,
      Page,
      Choice,
      FlowChartLock,
      BookComment,
      Board,
      Thread,
      ThreadView,
      ThreadComment,
      ThreadLiked,
    ]),
  ],
  exports: [
    AuthService,
    MembersService,
    MemberMapper,
    PaginationMapper,
    FilesService,
    BooksService,
    BookLikedService,
    LanesService,
    PagesService,
    ChoicesService,
    LocksService,
    BookCommentsService,
    BoardsService,
    ThreadsService,
    ThreadCommentsService,
    ThreadLikedService,
  ],
  providers: [
    AuthService,
    MembersService,
    MemberMapper,
    PaginationMapper,
    FilesService,
    BooksService,
    BookLikedService,
    LanesService,
    PagesService,
    ChoicesService,
    LocksService,
    BookCommentsService,
    BoardsService,
    ThreadsService,
    ThreadCommentsService,
    ThreadLikedService,
  ],
})
export class SharedModule {}
