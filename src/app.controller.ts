import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Public, ResponseMessage } from './decorator/customize';
import { ApiOperation } from '@nestjs/swagger';
import logger from './logger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  @ResponseMessage('Trang chủ')
  @ApiOperation({ summary: 'Trang chủ' })
  home() {
    logger.info('Home page accessed');
    logger.warn('Home page accessed');
    logger.error('Home page accessed');
    logger.debug('Home page accessed');
    return this.appService.home();
  }

  @Post('/chatbot/new')
  @ResponseMessage('Tạo prompt thành công')
  @ApiOperation({ summary: 'Tạo prompt với Chatbot AI' })
  chatbot(@Body() body: { prompt: string }) {
    return this.appService.chatbot(body.prompt);
  }
}
