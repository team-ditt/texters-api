import {AuthController} from "@/features/auth/auth.controller";
import {AuthService} from "@/features/auth/auth.service";
import {Auth} from "@/features/auth/model/auth.entity";
import {MembersModule} from "@/features/members/members.module";
import {HttpModule} from "@nestjs/axios";
import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";
import {TypeOrmModule} from "@nestjs/typeorm";

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
    HttpModule,
    TypeOrmModule.forFeature([Auth]),
    MembersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
