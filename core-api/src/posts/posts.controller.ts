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
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IUser } from 'src/users/users.interface';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { isUUID } from 'class-validator';
import { Doc } from 'src/decorator/doc.decorator';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @Public()
  @ResponseMessage('Fetch posts feed successfully')
  @ApiOperation({ summary: 'Get posts feed' })
  @Doc({
    summary: 'Get posts feed',
    request: {
      queries: [
        { name: 'page', description: 'Page number', required: false },
        { name: 'limit', description: 'Limit per page', required: false },
        { name: 'user_id', description: 'User ID', required: false },
      ],
    },
  })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('user_id') user_id?: string,
    @User() user?: IUser,
  ) {
    return this.postsService.findAll(page || 1, limit || 10, user_id, user);
  }

  @Post()
  @Public()
  @ResponseMessage('Create post successfully')
  @ApiOperation({ summary: 'Create post' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string' },
        privacy: { type: 'string', enum: ['public', 'friend', 'private'] },
        'medias-posts': {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @Doc({
    summary: 'Create post',
    request: {
      bodyType: 'FORM_DATA',
    },
  })
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

  @Patch()
  @ResponseMessage('Cập nhật bài viết thành công')
  @ApiOperation({ summary: 'Cập nhật bài viết' })
  @ApiBody({ type: UpdatePostDto })
  update(@User() user: IUser, @Body() dto: UpdatePostDto) {
    return this.postsService.update(user, dto);
  }

  @Delete(':id')
  @ResponseMessage('Xóa bài viết thành công')
  @ApiOperation({ summary: 'Xóa bài viết' })
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
