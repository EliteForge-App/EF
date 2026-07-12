import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { HttpToRpcExceptionFilter } from '@ef/common';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const config = appContext.get(ConfigService);
  await appContext.close();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: config.get<string>('USERS_SERVICE_HOST', '0.0.0.0'),
        port: config.get<number>('USERS_SERVICE_PORT', 3002),
      },
    },
  );

  app.useGlobalFilters(new HttpToRpcExceptionFilter());

  await app.listen();
  console.log(
    `Users Service (TCP) running on port ${config.get<number>('USERS_SERVICE_PORT', 3002)}`,
  );
}

bootstrap();
