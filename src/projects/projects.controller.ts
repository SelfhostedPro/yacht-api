import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GitUrlDTO } from './classes';
import { ProjectsService } from './projects.service';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  getProjects(): String {
    var hello = 'hello';
    return hello;
  }

  @Post()
  async addGitProject(@Body() gitUrl: GitUrlDTO): Promise<any> {
    try {
      var test = await this.projectsService.addGitProject(gitUrl);
      return test;
    } catch (err) {
      // Error Handling
      // if (err.statusCode) {
      //   throw new HttpException(err.message, err.statusCode);
      // } else {
      //   throw new HttpException(err.message, 500);
      // }
    }
  }
}
