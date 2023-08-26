import {SharedModule} from "@/features/shared/shared.module";
import {Module} from "@nestjs/common";
import {PublishedPagesController} from "./published-pages.controller";

@Module({
  imports: [SharedModule],
  controllers: [PublishedPagesController],
})
export class PublishedPagesModule {}
