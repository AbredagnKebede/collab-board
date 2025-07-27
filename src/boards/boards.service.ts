import { Injectable, NotFoundException } from '@nestjs/common';
import { Board } from './entities/board.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { User } from 'src/users/entities/user.entity';
import { use } from 'passport';
import { UpdateBoardtDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
    constructor(
        @InjectRepository(Board)
        private readonly boardsRepository: Repository<Board>,
        
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,     
    ) {}

    async create(createBoardDto: CreateBoardDto, user: User) {
        const project = await this.projectRepository.findOneBy({id: createBoardDto.peojectId});
        if(!project) throw new NotFoundException('Project not found');

        const board = await this.boardsRepository.create({
            title: createBoardDto.title,
            project,
            createdBy: user,
        });

        return this.boardsRepository.save(board);
    }

    async findAll() {
        return this.boardsRepository.find({relations: ['project', 'createdBy']});
    }

    async findOne(id: number) {
        const board = await this.boardsRepository.findOne({
            where: {id},
            relations: ['project', 'createdBy'],
        });

        if(!board) throw new NotFoundException('Board not found');
        return board;
    }

    async update(id: number, updateBoardDto: UpdateBoardtDto) {
        const board = await this.boardsRepository.preload({
            id,
            ...updateBoardDto,
        });

        if(!board) throw new NotFoundException('Board not found');
        return this.boardsRepository.save(board);
    }

    async remove(id: number) {
        const board = await this.boardsRepository.findOne({where: {id}});
        if(!board) throw new NotFoundException('Board not found');

        return this.boardsRepository.remove(board);
    }
}
