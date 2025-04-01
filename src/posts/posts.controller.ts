import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IUser } from 'src/users/users.interface';
import { ResponseMessage, User } from 'src/decorator/customize';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ResponseMessage('Create post successfully')
  @ApiOperation({ summary: 'Create post' })
  create(@User() user: IUser, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(user, createPostDto);
  }

  @Get()
  @ResponseMessage('Tìm kiếm tất cả bài viết thành công')
  @ApiOperation({ summary: 'Tìm kiếm tất cả bài viết' })
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @ResponseMessage('Tìm kiếm bài viết thành công')
  @ApiOperation({ summary: 'Tìm kiếm bài viết' })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch('all')
  @ResponseMessage('Xóa bài viết thành công')
  @ApiOperation({ summary: 'Cập nhật bài viết' })
  @ApiBody({ type: UpdatePostDto })
  update(@User() user: IUser, dto: UpdatePostDto) {
    // if (!isUUID(dto?.id))
    //   throw new BadRequestException('Id does not type uuid');
    console.log('=>> check');
    console.log(dto);

    return this.postsService.update(user, dto);
  }

  @Delete(':id')
  @ResponseMessage('Xóa bài viết thành công')
  @ApiOperation({ summary: 'Xóa bài viết' })
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
