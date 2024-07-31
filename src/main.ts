import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 运行管道
  app.useGlobalPipes(new ValidationPipe({
    // 开启白名单
    whitelist: true
  }))
  app.setGlobalPrefix('api/v1');
  await app.listen(8880);
}
bootstrap();
