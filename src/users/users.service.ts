import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';


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
        return this.userRepository.findOne({where: {email}, relations: ['projects', 'projectsAsMember', 'boards']});
    }

    async verifyEmail(userId: number): Promise<void> {
        await this.userRepository.update(userId, {isEmailVerified: true});
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find({relations: ['projects', 'projectsAsMember', 'boards']});
    }

    async deleteById(userId: number): Promise<DeleteResult> {
        const user = await this.userRepository.findOneBy({id: userId});
        if(!user) {
            throw new UnauthorizedException('User not found');
        }
        return this.userRepository.delete(userId);
    }

    async update(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.userRepository.preload({
            id: userId,
            ...updateUserDto
        });
        if (!user) throw new UnauthorizedException('User not found');
        return this.userRepository.save(user);
    }
}
