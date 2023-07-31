import {SharedModule} from "@/features/shared/shared.module";
import {Module} from "@nestjs/common";
import {BookLikedController} from "./book-liked.controller";

@Module({
  imports: [SharedModule],
  controllers: [BookLikedController],
})
export class BookLikedModule {}
