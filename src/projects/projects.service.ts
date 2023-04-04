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
  async addDockerComposeProject(dockerCompose: string, projectName: string) {
    const fs = require('fs');
    //write dockerCompose to a new file in the projects folder named after the projectName
    const baseDir = process.cwd() + '/projects';
    // Create projects folder if it doesn't exist
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir);
    }
    fs.writeFile(baseDir + projectName, dockerCompose, function (err: any) {
      if (err) throw err;
    });
  }
}
