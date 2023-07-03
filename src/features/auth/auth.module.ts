import {MembersModule} from "@/features/members";
import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {Auth} from "./model/auth.entity";

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {expiresIn: "30m"},
      }),
    }),
    TypeOrmModule.forFeature([Auth]),
    MembersModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
