import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ping')
  ping(): string {
    return 'pong';
  }

  @Get('status')
  status(): { status: string } {
    return { status: 'ok' };
  }
}
