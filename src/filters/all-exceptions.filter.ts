import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { ReqDataInterface } from '@Common/types/req-data.interface';

/** This filter catches all unhandled exceptions in the application. */

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  async catch(exception: any, host: ArgumentsHost) {
    console.error(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<ReqDataInterface>();

    try {
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      let message: string = '';

      if (
        status == 400 &&
        exception.response &&
        exception.response.message &&
        Array.isArray(exception.response.message)
      ) {
        // return validation errors as one string
        return response.status(400).json({
          ...exception.response,
          message: exception.response.message?.join(', ') || 'Unknown Error',
        });
      }

      message = message || exception?.response?.message || exception?.message;

      const safeResponse =
        exception?.response && typeof exception.response === 'object'
          ? Object.fromEntries(
              Object.entries(exception.response).filter(
                ([key]) =>
                  !['statusCode', 'message', 'path', 'timestamp'].includes(key),
              ),
            )
          : {};

      return response.status(status).json({
        statusCode: status,
        message,
        path: request.url,
        timestamp: new Date().toISOString(),
        ...safeResponse,
      });

      //
      //
      //
    } catch (err) {
      // this case for errors, which could not handle in try block

      console.error('Something went wrong (Server Error)', err);

      if (response) {
        response
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json(
            err?.response ||
              'Something went wrong (Server Error, AllExceptionsFilter last catch)',
          );
      } else {
        return (
          err?.response ||
          'Something went wrong (Server Error, AllExceptionsFilter last catch)'
        );
      }
    }
  }
}
