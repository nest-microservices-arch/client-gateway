import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();

    const rcpError = exception.getError();

    if (
      typeof rcpError === 'object' &&
      'status' in rcpError &&
      'message' in rcpError
    ) {
      const status: number = rcpError.status as number;
      return response.status(status).json(rcpError);
    }

    if (typeof rcpError === 'object' && 'message' in rcpError) {
      const message: string = rcpError.message as string;
      return response.status(500).json({
        statusCode: 500,
        message: message
          .toString()
          .substring(0, message.toString().indexOf('(') - 1),
      });
    }
    response.status(400).json({
      statusCode: 400,
      message: 'Bad Request',
    });
  }
}
