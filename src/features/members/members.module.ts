import {MemberMapper} from "@/features/members/member.mapper";
import {MembersController} from "@/features/members/members.controller";
import {MembersService} from "@/features/members/members.service";
import {Member} from "@/features/members/model/member.entity";
import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  exports: [MembersService, MemberMapper],
  controllers: [MembersController],
  providers: [MembersService, MemberMapper],
})
export class MembersModule {}
