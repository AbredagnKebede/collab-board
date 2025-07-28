import { Injectable, NotFoundException, ForbiddenException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  async create(createDto: CreateProjectDto, user: User) {
    const project = this.projectRepo.create({
      ...createDto,
      createdBy: user,
      members: [user],
    });

    const saved = await this.projectRepo.save(project);

    return this.projectRepo.findOne({
      where: { id: saved.id },
      relations: ['createdBy', 'members', 'boards'],
    });
  }

  async findAll() {
    return this.projectRepo.find({
      relations: ['createdBy', 'members', 'boards'],
    });
  }

  async findOne(id: number, user: User) {
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: ['createdBy', 'members'],
    });

    if (!project) throw new NotFoundException('Project not found');

    if (!project.createdBy)
      throw new ForbiddenException('Project creator is missing');

    const isCreator = project.createdBy.id === user.id;
    const isMember = project.members.some((member) => member.id === user.id);

    if (!isCreator && !isMember) {
      throw new ForbiddenException('You do not have access to this project');
    }

    return project;
  }

  async update(id: number, updateDto: UpdateProjectDto, user: User) {
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!project) throw new NotFoundException('Project not found');

    if (!project.createdBy || project.createdBy.id !== user.id) {
      throw new ForbiddenException('Only the creator can update this project');
    }

    const updated = await this.projectRepo.preload({
      id,
      ...updateDto,
    });

    if (!updated) throw new NotFoundException('Project not found');
    return this.projectRepo.save(updated);
  }

  async remove(id: number, user: User) {
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!project) throw new NotFoundException('Project not found');

    if (!project.createdBy || project.createdBy.id !== user.id) {
      throw new ForbiddenException('Only the creator can delete this project');
    }

    return this.projectRepo.remove(project);
  }
}
