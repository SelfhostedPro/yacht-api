import { Controller, HttpException, Sse, UseGuards, Get, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../guards/accessToken.guard';
import { NotificationsService } from './notifications.service';
import { Observable } from 'rxjs';



@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Sse()
    async streamNotifications(): Promise<Observable<any>> {
        try {
            const test = this.notificationsService.getStream()
            test.subscribe(data => console.log('test'))
            return this.notificationsService.getStream()
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
