import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { EmailVerificationService } from 'src/auth/email-verification/email-verification.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private emailVerificationService: EmailVerificationService,
        private jwtService: JwtService,
        private mailService: MailService,
    ) {}
    
    async register(createUserDto: CreateUserDto): Promise<any> {
        const user = await this.userService.create(createUserDto);
        const token = await this.emailVerificationService.generateToken(user.id);
        await this.mailService.sendVerificationEmail(user.email, token);
        return { message: 'User registered successfully. Please check your email to verify your account.' };
    }

    async validateUser(email:string, password:string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        else if (user && !user.isEmailVerified) {
            throw new UnauthorizedException('Email not verified');
        }
        else if (user && !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid password');
        }
        return user;
    }

    async login(user: any): Promise<any> {
        const payload = {sub: user.id, email: user.email};
        return {
            access_token : this.jwtService.sign(payload),
        };
    }

    async verifyEmail(token: string): Promise<any> {
        const userId = await this.emailVerificationService.verifyToken(token);
        if (!userId) {
            return { message: 'Invalid or expired token' };
        }
        await this.userService.verifyEmail(userId);
    }
}
