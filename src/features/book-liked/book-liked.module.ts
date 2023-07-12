import {BookLiked} from "@/features/book-liked/model/book-liked.entity";
import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {BookLikedController} from "./book-liked.controller";
import {BookLikedService} from "./book-liked.service";

@Module({
  imports: [TypeOrmModule.forFeature([BookLiked])],
  controllers: [BookLikedController],
  providers: [BookLikedService],
})
export class BookLikedModule {}
