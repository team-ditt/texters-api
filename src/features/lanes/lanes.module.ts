import {SharedModule} from "@/features/shared/shared.module";
import {Module} from "@nestjs/common";
import {LanesController} from "./lanes.controller";

@Module({
  imports: [SharedModule],
  controllers: [LanesController],
})
export class LanesModule {}
