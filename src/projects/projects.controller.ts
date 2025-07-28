import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UnauthorizedException} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(@Body() dto: CreateProjectDto, @Req() req: Request) {
    const user = req.user as User;
    this.ensureAuthenticated(user);
    return this.projectsService.create(dto, user);
  }

  @Get()
  async findAll(@Req() req: Request) {
    const user = req.user as User;
    this.ensureAuthenticated(user);
    return this.projectsService.findAll(); 
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as User;
    this.ensureAuthenticated(user);
    return this.projectsService.findOne(+id, user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    this.ensureAuthenticated(user);
    return this.projectsService.update(+id, dto, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as User;
    this.ensureAuthenticated(user);
    return this.projectsService.remove(+id, user);
  }

  @Get('me')
  async getCurrentUser(@Req() req: Request) {
    const user = req.user as User;
    this.ensureAuthenticated(user);
    const { password, ...safeUser } = user;
    return safeUser;
  }

  private ensureAuthenticated(user: User | undefined): void {
    if (!user || !user.id) {
      throw new UnauthorizedException('User not authenticated');
    }
  }
}
