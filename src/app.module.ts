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
import { TerminalModule } from './terminal/terminal.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from './config/config.module';
import { SetupWizardModule } from './setup-wizard/setup-wizard.module';
import { LoggerModule } from './logger/logger.module';
import { TemplatesService } from './templates/templates.service';
import { TemplatesModule } from './templates/templates.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ContainersModule,
    ProjectsModule,
    AuthModule,
    TerminalModule,
    UsersModule,
    ConfigModule,
    LoggerModule,
    SetupWizardModule,
    TemplatesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'ui'),
      exclude: ['/api/(.*)'],
    }),
  ],
  controllers: [AppController, ContainersController, ProjectsController],
  providers: [AppService, ContainersService, ProjectsService, TemplatesService],
})
export class AppModule {}
