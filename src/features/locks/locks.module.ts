import {SharedModule} from "@/features/shared/shared.module";
import {Module} from "@nestjs/common";

@Module({
  imports: [SharedModule],
})
export class LocksModule {}
