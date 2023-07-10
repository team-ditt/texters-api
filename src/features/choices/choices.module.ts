import {SharedModule} from "@/features/shared/shared.module";
import {Module} from "@nestjs/common";
import {ChoicesController} from "./choices.controller";

@Module({
  imports: [SharedModule],
  controllers: [ChoicesController],
})
export class ChoicesModule {}
