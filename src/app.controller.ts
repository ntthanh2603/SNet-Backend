import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Public, ResponseMessage } from './decorator/customize';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LogNestService } from './logger/log-nest.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private logNestService: LogNestService,
  ) {}

  @Get()
  @Public()
  @ResponseMessage('Trang chủ')
  @ApiOperation({ summary: 'Trang chủ' })
  home() {
    this.logNestService.log('Home endpoint accessed', 'AppController');
    this.logNestService.debug('Debugging home endpoint', 'AppController');
    this.logNestService.warn(
      'Warning: Home endpoint accessed',
      'AppController',
    );
    this.logNestService.error('Error: Home endpoint accessed', 'AppController');

    return this.appService.home();
  }

  @Post('/chatbot/new')
  @ResponseMessage('Tạo prompt thành công')
  @ApiOperation({ summary: 'Tạo prompt với Chatbot AI' })
  chatbot(@Body() body: { prompt: string }) {
    return this.appService.chatbot(body.prompt);
  }
}
