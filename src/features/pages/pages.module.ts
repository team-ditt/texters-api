import {PageMapper} from "@/features/pages/page.mapper";
import {SharedModule} from "@/features/shared/shared.module";
import {Module} from "@nestjs/common";
import {PagesController} from "./pages.controller";

@Module({
  imports: [SharedModule],
  controllers: [PagesController],
  providers: [PageMapper],
})
export class PagesModule {}
