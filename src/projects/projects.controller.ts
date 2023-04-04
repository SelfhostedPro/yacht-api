import { Body, Controller, Get, HttpException, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GitUrlDTO } from './classes';
import { ProjectsService } from './projects.service';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  getProjects(): string {
    const hello = 'hello';
    return hello;
  }

  @Post()
  async addGitProject(@Body() gitUrl: GitUrlDTO): Promise<any> {
    try {
      const test = await this.projectsService.addGitProject(gitUrl);
      return test;
    } catch (err) {
      // Error Handling
      if (err.statusCode) {
        throw new HttpException(err.message, err.statusCode);
      } else {
        throw new HttpException(err.message, 500);
      }
    }
  }
  //Nestjs Post request  that takes a docker-compose file and a name and creates a project
  @Post()
  async addDockerComposeProject(
    @Body() dockerCompose: string,
    projectName: string,
  ): Promise<any> {
    try {
      const test = await this.projectsService.addDockerComposeProject(
        dockerCompose,
        projectName,
      );
      return test;
    } catch (err) {
      // Error Handling
      if (err.statusCode) {
        throw new HttpException(err.message, err.statusCode);
      } else {
        throw new HttpException(err.message, 500);
      }
    }
  }
}
