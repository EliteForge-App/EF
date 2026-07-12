import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

/**
 * Serializes HttpException for NestJS TCP microservices.
 * Without this filter, RpcExceptionsHandler returns a generic 500 to the client.
 */
@Catch(HttpException)
export class HttpToRpcExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpToRpcExceptionFilter.name);

  catch(exception: HttpException, _host: ArgumentsHost): Observable<never> {
    const statusCode = exception.getStatus();
    const response = exception.getResponse();
    const message =
      typeof response === 'string'
        ? response
        : ((response as { message?: string | string[] }).message ??
          'Internal server error');

    if (statusCode >= 500) {
      this.logger.error(
        `HTTP ${statusCode}: ${JSON.stringify(message)}`,
        exception.stack,
      );
    }

    return throwError(
      () =>
        new RpcException({
          statusCode,
          message,
        }),
    );
  }
}
