import { Controller, Post, UseGuards, Req, Body, Param, ParseIntPipe, Patch, Get, Delete} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from 'src/users/entities/user.entity';
import { Request } from 'express';
import { UpdateCommentDto } from './dto/update-comment.dto';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Post()
    async create(@Body() createCommentDto: CreateCommentDto, @Req() req: Request) {
        const user = req.user as User;
        return this.commentsService.create(createCommentDto, user);
    }

    @Get('card/:cardId')
    async findByCard(@Param('id', ParseIntPipe) id: number) {
        return this.commentsService.findByCard(id);
    }

    @Patch(':id')
    async update(@Body() updateCommentDto: UpdateCommentDto, @Param('id', ParseIntPipe) id: number) {
        return this.commentsService.update(id, updateCommentDto);
    }

    @Delete(':id') 
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.commentsService.remove(id);
    }
}
