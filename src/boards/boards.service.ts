import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Board } from './entities/board.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
    constructor(
        @InjectRepository(Board)
        private boardsRepository: Repository<Board>,
        
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,     
    ) {}

    async create(createBoardDto: CreateBoardDto, user: User) {
        const project = await this.projectRepository.findOneBy({id: createBoardDto.projectId});
        if(!project) throw new NotFoundException('Project not found');

        const hasAccess = project.createdBy.id === user.id || 
                         project.members.some(member => member.id === user.id);
        if (!hasAccess) {
            throw new ForbiddenException('You do not have access to this project');
        }

        const board = await this.boardsRepository.create({
            title: createBoardDto.title,
            project,
            createdBy: user,
        });

        return this.boardsRepository.save(board);
    }

    async findAll(user: User) {
        const userProjects = await this.projectRepository
            .createQueryBuilder('project')
            .leftJoinAndSelect('project.members', 'members')
            .where('project.createdBy.id = :userId', { userId: user.id })
            .orWhere('members.id = :userId', { userId: user.id })
            .getMany();

        const projectIds = userProjects.map(project => project.id);
        
        return this.boardsRepository.find({
            where: { project: { id: projectIds } as any },
            relations: ['project', 'createdBy']
        });
    }

    async findOne(id: number, user: User) {
        const board = await this.boardsRepository.findOne({
            where: {id},
            relations: ['project', 'project.createdBy', 'project.members', 'createdBy'],
        });

        if(!board) throw new NotFoundException('Board not found');
        
        const hasAccess = board.project.createdBy.id === user.id || 
                         board.project.members.some(member => member.id === user.id);
        if (!hasAccess) {
            throw new ForbiddenException('You do not have access to this board');
        }
        
        return board;
    }

    async update(id: number, updateBoardDto: UpdateBoardDto, user: User) {
        const board = await this.boardsRepository.findOne({
            where: {id},
            relations: ['project', 'project.createdBy', 'project.members', 'createdBy']
        });

        if(!board) throw new NotFoundException('Board not found');
        
        const hasAccess = board.project.createdBy.id === user.id || 
                         board.project.members.some(member => member.id === user.id);
        if (!hasAccess) {
            throw new ForbiddenException('You do not have access to this board');
        }

        if (board.createdBy.id !== user.id) {
            throw new ForbiddenException('Only the board creator can update this board');
        }

        const updatedBoard = await this.boardsRepository.preload({
            id,
            ...updateBoardDto,
        });

        if (!updatedBoard) {
            throw new NotFoundException('Board not found');
        }

        return this.boardsRepository.save(updatedBoard);
    }

    async remove(id: number, user: User) {
        const board = await this.boardsRepository.findOne({
            where: {id},
            relations: ['project', 'project.createdBy', 'project.members', 'createdBy']
        });
        
        if(!board) throw new NotFoundException('Board not found');

         const hasAccess = board.project.createdBy.id === user.id || 
                         board.project.members.some(member => member.id === user.id);
        if (!hasAccess) {
            throw new ForbiddenException('You do not have access to this board');
        }

        if (board.createdBy.id !== user.id) {
            throw new ForbiddenException('Only the board creator can delete this board');
        }

        return this.boardsRepository.remove(board);
    }
}
