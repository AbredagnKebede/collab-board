import { Controller, Get, Post, UseGuards, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService){}
    
    @Get()
    async findAll() {
        return this.userService.findAll();
    }

    @Post('delete')
    async delete(@Body('id') id: number) {
        return this.userService.deleteById(id);
    }
}
