import { Injectable, NotFoundException } from '@nestjs/common';
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

    async findAll() {
        return this.projectRepository.find({relations: ['createdBy', 'members']});
    }

    async findOne(id: number) {
        const project = await this.projectRepository.findOne({
            where: {id}, 
            relations: ['createdBy', 'members']
        });
    if (!project) throw new NotFoundException('Project not found');
    return project;
    }

    async update(id: string, updateProjectDto:UpdateProjectDto) {
        const project = await this.projectRepository.preload({
            id: +id,
            ...updateProjectDto,
        });
        if (!project) throw new NotFoundException('Project not found');
        return this.projectRepository.save(project);
    }

    async remove(id: string) {
        const project = await this.projectRepository.findOne({ where: { id: +id } });
        if (!project) throw new NotFoundException('Project not found'); 
        return this.projectRepository.remove(project);
    }
}
