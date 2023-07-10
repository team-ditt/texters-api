import {BackdoorController} from "@/features/backdoor/backdoor.controller";
import {BackdoorService} from "@/features/backdoor/backdoor.service";
import {MembersModule} from "@/features/members/members.module";
import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {expiresIn: "1d"},
      }),
    }),
    MembersModule,
  ],
  controllers: [BackdoorController],
  providers: [BackdoorService],
})
export class BackdoorModule {}
