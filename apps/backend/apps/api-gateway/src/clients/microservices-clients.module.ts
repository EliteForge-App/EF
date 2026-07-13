import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SERVICE_NAMES } from '@ef/common';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: SERVICE_NAMES.AUTH,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('AUTH_SERVICE_HOST', 'localhost'),
            port: config.get<number>('AUTH_SERVICE_PORT', 3001),
          },
        }),
      },
      {
        name: SERVICE_NAMES.USERS,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('USERS_SERVICE_HOST', 'localhost'),
            port: config.get<number>('USERS_SERVICE_PORT', 3002),
          },
        }),
      },
      {
        name: SERVICE_NAMES.VENUES,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('VENUES_SERVICE_HOST', 'localhost'),
            port: config.get<number>('VENUES_SERVICE_PORT', 3003),
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class MicroservicesClientsModule {}
