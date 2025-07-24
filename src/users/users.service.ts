import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { use } from 'passport';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ){}

    async create(createUserDto: CreateUserDto): Promise<any> {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = this.userRepository.create({
            ...createUserDto,  
            password: hashedPassword,
            isEmailVerified: false,
            role: 'user' 
        });
        return this.userRepository.save(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOneBy({email});
    }

    async verifyEmail(userId: number): Promise<void> {
        await this.userRepository.update(userId, {isEmailVerified: true});
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }
}
