import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  app
    .get(AppService)
    .handleCron()
    .finally(() => app.close());
}
bootstrap();
