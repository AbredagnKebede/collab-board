import { Controller, Get, Post, UseGuards, Body, Delete, Param, Patch, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService){}
    
    @Post('create')
    async create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get()
    async findAll() {
        return this.userService.findAll();
    }

    @Get(':email')
    async findByEmail(@Param('email') email: string) {
        return this.userService.findByEmail(email);
    }

    @Delete(':id')
    async deleteById(@Param('id') userId: number) {
        return this.userService.deleteById(userId);
    }

    @Patch(':id')
    async update(@Param('id', ParseIntPipe) userId: number, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(userId, updateUserDto);
    }
}
//admin role functionality can be added later---abredagn @dev