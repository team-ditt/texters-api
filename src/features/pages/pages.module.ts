import {SharedModule} from "@/features/shared/shared.module";
import {Module} from "@nestjs/common";
import {PagesController} from "./pages.controller";

@Module({
  imports: [SharedModule],
  controllers: [PagesController],
})
export class PagesModule {}
