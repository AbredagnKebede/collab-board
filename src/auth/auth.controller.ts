import { Body, Controller, Get, Post, Query, UnauthorizedException } from '@nestjs/common';
import { Auth } from 'typeorm';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const validatedUser = await this.authService.validateUser(loginDto.email, loginDto.password);
        return this.authService.login(validatedUser);
    }

    @Get('verify')
    async verifyEmail(@Query('token') token: string) {
        const result = await this.authService.verifyEmail(token);
        if(!result) {
            throw new UnauthorizedException('Invalid Verification Token!');
        }

        return { message: 'Verification Successful!'};
    }
}