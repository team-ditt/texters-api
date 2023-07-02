import {ValidationPipe} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get<string>("PORT");
  app.useGlobalPipes(new ValidationPipe({transform: true}));
  await app.listen(parseInt(PORT) || 3000);
}
bootstrap();
