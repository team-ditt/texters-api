import {AuthModule} from "@/features/auth/auth.module";
import {BackdoorModule} from "@/features/backdoor/backdoor.module";
import {BoardsModule} from "@/features/boards/boards.module";
import {BookCommentsModule} from "@/features/book-comments/book-comments.module";
import {BookLikedModule} from "@/features/book-liked/book-liked.module";
import {BooksModule} from "@/features/books/books.module";
import {ChoicesModule} from "@/features/choices/choices.module";
import {FilesModule} from "@/features/files/files.module";
import {LanesModule} from "@/features/lanes/lanes.module";
import {LocksModule} from "@/features/locks/locks.module";
import {MembersModule} from "@/features/members/members.module";
import {PagesModule} from "@/features/pages/pages.module";
import {ThreadCommentsModule} from "@/features/thread-comments/thread-comments.module";
import {ThreadsModule} from "@/features/threads/threads.module";
import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {DataSource} from "typeorm";

function featureModules() {
  const productionModules = [
    AuthModule,
    MembersModule,
    FilesModule,
    BooksModule,
    LanesModule,
    PagesModule,
    ChoicesModule,
    LocksModule,
    BookLikedModule,
    BookCommentsModule,
    BoardsModule,
    ThreadsModule,
    ThreadCommentsModule,
  ];
  const developmentModules = [BackdoorModule];
  return process.env.NODE_ENV === "PRODUCTION"
    ? productionModules
    : [...productionModules, ...developmentModules];
}

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres" as const,
        host: configService.get<string>("DATABASE_HOST"),
        port: parseInt(configService.get<string>("DATABASE_PORT")) || 5342,
        username: configService.get<string>("DATABASE_USERNAME"),
        password: configService.get<string>("DATABASE_PASSWORD"),
        database: configService.get<string>("DATABASE_NAME"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: process.env.NODE_ENV !== "PRODUCTION",
      }),
    }),
    ...featureModules(),
  ],
})
export class AppModule {
  constructor(private readonly dataSource: DataSource) {}
}
