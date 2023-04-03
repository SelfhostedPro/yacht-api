import { Module } from '@nestjs/common';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContainersController } from './containers/containers.controller';
import { ProjectsController } from './projects/projects.controller';
import { ContainersModule } from './containers/containers.module';
import { ProjectsModule } from './projects/projects.module';
import { AuthModule } from './auth/auth.module';
import { ContainersService } from './containers/containers.service';
import { ProjectsService } from './projects/projects.service';
import { TerminalModule } from './terminal/terminal.module';

@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    ContainersModule,
    ProjectsModule,
    AuthModule,
    TerminalModule,
  ],
  controllers: [AppController, ContainersController, ProjectsController],
  providers: [AppService, ContainersService, ProjectsService],
})
export class AppModule {}
