import { Injectable } from '@nestjs/common';
import { simpleGit, SimpleGit, SimpleGitOptions } from 'simple-git';
import { GitUrlDTO } from './classes';

@Injectable()
export class ProjectsService {
  async addGitProject(gitUrl: GitUrlDTO) {
    const options: Partial<SimpleGitOptions> = {
      baseDir: process.cwd() + '/projects',
    };
    const git: SimpleGit = simpleGit(options);
    return await git.clone(gitUrl.url);
  }
}
