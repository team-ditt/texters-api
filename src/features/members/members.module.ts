import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Member} from "./member.entity";
import {MembersController} from "./members.controller";
import {MembersService} from "./members.service";

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  providers: [MembersService],
  controllers: [MembersController],
})
export class MembersModule {}
