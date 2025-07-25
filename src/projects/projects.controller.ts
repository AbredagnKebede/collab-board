import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsSevice: ProjectsService) {}
    
    @Post('create')
    async create(@Body() createProjectDto: CreateProjectDto, @Req() req: Request) {
        const user = req.user as User; 
        return this.projectsSevice.create(createProjectDto, user);
    }

    @Get()
    async findAll() {
        return this.projectsSevice.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.projectsSevice.findOne(+id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
        return this.projectsSevice.update(id, updateProjectDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) { 
        return this.projectsSevice.remove(id);
    }
}
