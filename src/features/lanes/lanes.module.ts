import {BooksModule} from "@/features/books/books.module";
import {Lane} from "@/features/lanes/model/lane.entity";
import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {LanesController} from "./lanes.controller";
import {LanesService} from "./lanes.service";

@Module({
  imports: [TypeOrmModule.forFeature([Lane]), BooksModule],
  controllers: [LanesController],
  providers: [LanesService],
})
export class LanesModule {}
