import {ValidationPipe} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {NestFactory} from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import {AppModule} from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get<string>("PORT");

  app.setGlobalPrefix("api/v1");
  app.enableCors({origin: ["https://texters.io", "https://www.texters.io"]});
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({transform: true}));
  await app.listen(parseInt(PORT) || 3000);
}
bootstrap();
