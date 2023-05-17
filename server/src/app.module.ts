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
import { LoggerModule } from './common/logger/logger.module';
import { TemplatesService } from './templates/templates.service';
import { TemplatesModule } from './templates/templates.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ServersModule } from './servers/servers.module';
import { ResourcesModule } from './resources/resources.module';
import { SettingsModule } from './settings/settings.module';
import { NotificationsModule } from './common/notifications/notifications.module';
import { NotificationsController } from './common/notifications/notifications.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';


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
    EventEmitterModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'ui'),
      exclude: ['/api/(.*)'],
    }),
    ServersModule,
    ResourcesModule,
    SettingsModule,
    NotificationsModule,
  ],
  controllers: [AppController, ContainersController, ProjectsController, NotificationsController],
  providers: [AppService, ContainersService, ProjectsService, TemplatesService],
})
export class AppModule {}
