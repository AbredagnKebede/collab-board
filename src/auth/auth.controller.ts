import { Body, Controller, Get, Post, Query, UnauthorizedException, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Get('verify-email')
    async verifyEmail(@Query('token') token: string) {
        const result = await this.authService.verifyEmail(token);
        if(!result) {
            throw new UnauthorizedException('Invalid Verification Token!');
        }

        return { message: 'Verification Successful!'};
    }
}