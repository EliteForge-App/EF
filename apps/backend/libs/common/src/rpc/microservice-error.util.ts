import {
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

const logger = new Logger('MicroserviceError');

interface RpcErrorPayload {
  statusCode?: number;
  message?: string | string[];
  error?: string;
}

function extractRpcPayload(error: Record<string, unknown>): RpcErrorPayload | null {
  const nestedError = error.error;
  if (
    typeof nestedError === 'object' &&
    nestedError !== null &&
    'statusCode' in nestedError
  ) {
    return nestedError as RpcErrorPayload;
  }

  const rawMessage = error.message;

  if (typeof rawMessage === 'object' && rawMessage !== null && !Array.isArray(rawMessage)) {
    const payload = rawMessage as RpcErrorPayload;
    if (payload.statusCode !== undefined || payload.message !== undefined) {
      return payload;
    }
  }

  if (typeof rawMessage === 'string') {
    const statusCode =
      typeof error.statusCode === 'number'
        ? error.statusCode
        : HttpStatus.INTERNAL_SERVER_ERROR;
    return { message: rawMessage, statusCode };
  }

  if (typeof error.statusCode === 'number') {
    return {
      statusCode: error.statusCode,
      message:
        typeof error.message === 'string'
          ? error.message
          : 'Internal server error',
    };
  }

  return null;
}

function normalizeMessage(body: unknown): string | string[] {
  if (typeof body === 'string' || Array.isArray(body)) {
    return body;
  }

  if (typeof body === 'object' && body !== null && 'message' in body) {
    const nested = (body as RpcErrorPayload).message;
    if (typeof nested === 'string' || Array.isArray(nested)) {
      return nested;
    }
  }

  return 'Internal server error';
}

/**
 * Maps NestJS microservice RPC errors to HttpException for the API Gateway.
 */
export function toHttpException(error: unknown): HttpException {
  if (error instanceof HttpException) {
    return error;
  }

  if (typeof error === 'object' && error !== null) {
    const rpcError = error as Record<string, unknown>;
    const payload = extractRpcPayload(rpcError);

    if (payload) {
      const status = payload.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;
      const body = normalizeMessage(
        payload.message ??
          (typeof rpcError.message === 'string' ? rpcError.message : 'Internal server error'),
      );

      if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
        logger.error(`RPC error (${status}): ${JSON.stringify(body)}`);
      } else {
        logger.warn(`RPC client error (${status}): ${JSON.stringify(body)}`);
      }

      return new HttpException(body, status);
    }
  }

  const message =
    error instanceof Error ? error.message : 'Internal server error';

  logger.error(`Unhandled RPC error: ${message}`, error instanceof Error ? error.stack : undefined);

  return new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
}
