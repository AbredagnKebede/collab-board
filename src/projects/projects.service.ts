import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto'
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
    ) {}

    async create(createProjectDto: CreateProjectDto, user: User) {
        const project = this.projectRepository.create({
            ...createProjectDto,
            createdBy: user,
            members: [user] 
        });
        return this.projectRepository.save(project);
    }

    async findAll(user: User) {
        return this.projectRepository
            .createQueryBuilder('project')
            .leftJoinAndSelect('project.createdBy', 'createdBy')
            .leftJoinAndSelect('project.members', 'members')
            .where('project.createdBy.id = :userId', { userId: user.id })
            .orWhere('members.id = :userId', { userId: user.id })
            .getMany();
    }

    async findOne(id: number, user: User) {
        const project = await this.projectRepository.findOne({
            where: {id}, 
            relations: ['createdBy', 'members']
        });
        if (!project) throw new NotFoundException('Project not found');
        
        const hasAccess = project.createdBy.id === user.id || 
                         project.members.some(member => member.id === user.id);
        if (!hasAccess) {
            throw new ForbiddenException('You do not have access to this project');
        }
        
        return project;
    }

    async update(id: number, updateProjectDto: UpdateProjectDto, user: User) {
        const project = await this.projectRepository.findOne({
            where: { id: +id },
            relations: ['createdBy', 'members']
        });
        if (!project) throw new NotFoundException('Project not found');
        
        if (project.createdBy.id !== user.id) {
            throw new ForbiddenException('Only the project creator can update this project');
        }
        
        const updatedProject = await this.projectRepository.preload({
            id: +id,
            ...updateProjectDto,
        });
        if (!updatedProject) {
            throw new NotFoundException('Project not found');
        }
        return this.projectRepository.save(updatedProject);
    }

    async remove(id: number, user: User) {
        const project = await this.projectRepository.findOne({ 
            where: { id: +id },
            relations: ['createdBy', 'members']
        });
        if (!project) throw new NotFoundException('Project not found');
        
        if (project.createdBy.id !== user.id) {
            throw new ForbiddenException('Only the project creator can delete this project');
        }
        
        return this.projectRepository.remove(project);
    }
}
