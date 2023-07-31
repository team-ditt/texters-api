import {MembersController} from "@/features/members/members.controller";
import {SharedModule} from "@/features/shared/shared.module";
import {Module} from "@nestjs/common";

@Module({
  imports: [SharedModule],
  controllers: [MembersController],
})
export class MembersModule {}
