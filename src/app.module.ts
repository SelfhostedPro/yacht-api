import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContainersController } from './containers/containers.controller';
import { ProjectsController } from './projects/projects.controller';
import { ContainersModule } from './containers/containers.module';
import { ProjectsModule } from './projects/projects.module';
import { AuthModule } from './auth/auth.module';
import { ContainersService } from './containers/containers.service';
import { ProjectsService } from './projects/projects.service';

@Module({
  imports: [ContainersModule, ProjectsModule, AuthModule],
  controllers: [AppController, ContainersController, ProjectsController],
  providers: [AppService, ContainersService, ProjectsService],
})
export class AppModule {}
