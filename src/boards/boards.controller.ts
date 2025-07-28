import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { User } from 'src/users/entities/user.entity';
import { Request } from 'express';
import { UpdateBoardDto } from './dto/update-board.dto';

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
    async findAll(@Req() req: Request) {
        const user = req.user as User;
        return this.boardsService.findAll(user);
    }
    
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
        const user = req.user as User;
        return this.boardsService.findOne(id, user);
    }

    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateBoardDto: UpdateBoardDto, @Req() req: Request) {
        const user = req.user as User;
        return this.boardsService.update(id, updateBoardDto, user);
    }

    @Delete(':id') 
    async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
        const user = req.user as User;
        return this.boardsService.remove(id, user);
    }
}
