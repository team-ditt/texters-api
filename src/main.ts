import {ValidationPipe} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {NestFactory} from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import * as requestIp from "request-ip";
import {AppModule} from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get<string>("PORT");

  app.setGlobalPrefix("api/v1");
  app.enableCors({
    origin: configService.get<string>("CLIENT_URL"),
    credentials: true,
    exposedHeaders: ["X-Flow-Chart-Lock-Key"],
  });
  app.use(cookieParser());
  app.use(requestIp.mw());
  app.useGlobalPipes(new ValidationPipe({transform: true}));
  await app.listen(parseInt(PORT) || 3000);
}
bootstrap();
