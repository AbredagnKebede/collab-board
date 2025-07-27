import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { User } from 'src/users/entities/user.entity';
import { Request } from 'express';
import { UpdateBoardtDto } from './dto/update-board.dto';

@UseGuards(JwtAuthGuard)
@Controller('boards')
export class BoardsController {
    constructor(private readonly boardsService: BoardsService){}

    @Post()
    async create(@Body() createBoardDto: CreateBoardDto, @Req() req: Request) {
        const user = req.user as User;
        return this.boardsService.create(createBoardDto, user);
    }

    @Get()
    async findAll() {
        return this.boardsService.findAll();
    }
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.boardsService.findOne(+id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardtDto) {
        return this.boardsService.update(+id, updateBoardDto);
    }

    @Delete(':id') 
    async remove(@Param('id') id: string) {
        return this.boardsService.remove(+id);
    }
}
