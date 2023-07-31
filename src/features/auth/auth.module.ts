import {AuthController} from "@/features/auth/auth.controller";
import {SharedModule} from "@/features/shared/shared.module";
import {Module} from "@nestjs/common";

@Module({
  imports: [SharedModule],
  controllers: [AuthController],
})
export class AuthModule {}
