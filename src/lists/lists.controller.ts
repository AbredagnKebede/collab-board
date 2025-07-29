import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateListDto } from './dto/update-list.dto';

@UseGuards(JwtAuthGuard)
@Controller('lists')
export class ListsController {
    constructor(private readonly listsService: ListsService) {}

    @Post()
    async create(@Body() createListDto: CreateListDto) {
        return this.listsService.create(createListDto);
    }

    @Get()
    async findAll() { 
        return this.listsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.listsService.findOne(id);
    }

    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number ,@Body() updateListDto: UpdateListDto) {
        return this.listsService.update(id, updateListDto);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number){
        return this.listsService.remove(id);    
    }
}
