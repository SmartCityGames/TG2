import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from './app.service';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'client-dist') }),
  ],
  providers: [AppService],
})
export class AppModule {}
