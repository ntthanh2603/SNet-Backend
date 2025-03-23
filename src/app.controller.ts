import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Public, ResponseMessage } from './decorator/customize';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  @ResponseMessage('Trang chủ')
  @ApiOperation({ summary: 'Trang chủ' })
  home() {
    return this.appService.home();
  }

  @Post('/chatbot/new')
  @ResponseMessage('Tạo prompt thành công')
  @ApiOperation({ summary: 'Tạo prompt với Chatbot AI' })
  chatbot(@Body() body: { prompt: string }) {
    return this.appService.chatbot(body.prompt);
  }
}
