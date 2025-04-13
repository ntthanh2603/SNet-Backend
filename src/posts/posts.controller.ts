import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  HttpStatus,
  ParseFilePipeBuilder,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IUser } from 'src/users/users.interface';
import { ResponseMessage, User } from 'src/decorator/customize';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { isUUID } from 'class-validator';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ResponseMessage('Create post successfully')
  @ApiOperation({ summary: 'Create post' })
  @UseInterceptors(FilesInterceptor('medias-posts', 10))
  create(
    @User() user: IUser,
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|gif)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 10, // 10MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    file: Express.Multer.File[],
  ) {
    return this.postsService.create(user, createPostDto, file);
  }

  @Get(':id')
  @ResponseMessage('Find post by id successfully')
  @ApiOperation({ summary: 'Find post by id' })
  findOne(@Param('id') id: string, @User() user: IUser) {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
    return this.postsService.findOne(user, id);
  }

  @Patch('all')
  @ResponseMessage('Xóa bài viết thành công')
  @ApiOperation({ summary: 'Cập nhật bài viết' })
  @ApiBody({ type: UpdatePostDto })
  update(@User() user: IUser, dto: UpdatePostDto) {
    return this.postsService.update(user, dto);
  }

  @Delete(':id')
  @ResponseMessage('Xóa bài viết thành công')
  @ApiOperation({ summary: 'Xóa bài viết' })
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
