import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const raw =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Nest a menudo devuelve { statusCode, message, error }; exponer solo message
    // para que clientes (web ApiError) lean string | string[] correctamente.
    const message =
      typeof raw === 'string'
        ? raw
        : typeof raw === 'object' &&
            raw !== null &&
            'message' in raw &&
            (typeof (raw as { message: unknown }).message === 'string' ||
              Array.isArray((raw as { message: unknown }).message))
          ? (raw as { message: string | string[] }).message
          : raw;

    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}

