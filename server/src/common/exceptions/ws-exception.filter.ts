
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException, WsResponse } from '@nestjs/websockets';
import { Request, Response } from 'express';
import { Socket } from 'socket.io';

@Catch(WsException, HttpException)
export class WsExceptionFilter extends BaseWsExceptionFilter {
    catch(exception: WsException | HttpException, host: ArgumentsHost) {
        const client = host.switchToWs().getClient() as Socket;
        const data = host.switchToWs().getData();
        const error = exception instanceof WsException ? exception.getError() : exception.getResponse();
        const details = error instanceof Object ? { ...error } : { message: error };

        if (typeof error === 'object' && error !== null) {
            if (error['statusCode']) {
                switch (error['statusCode']) {
                    case 401: {
                        client.emit('error', {
                            event: 'error',
                            data: 'Unauthorized',
                        })
                        client.disconnect(true)
                    }
                    default: {
                        break
                    }
                }
            } 
        }
    }
}
