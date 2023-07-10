import {AuthModule} from "@/features/auth/auth.module";
import {BackdoorModule} from "@/features/backdoor/backdoor.module";
import {BooksModule} from "@/features/books/books.module";
import {FilesModule} from "@/features/files/files.module";
import {MembersModule} from "@/features/members/members.module";
import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {DataSource} from "typeorm";

function featureModules() {
  const productionModules = [AuthModule, MembersModule, FilesModule, BooksModule];
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
        synchronize: true,
      }),
    }),
    ...featureModules(),
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
