import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MicroservicesClientsModule } from './clients/microservices-clients.module';
import { AuthProxyModule } from './auth/auth-proxy.module';
import { UsersProxyModule } from './users/users-proxy.module';
import { VenuesProxyModule } from './venues/venues-proxy.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MicroservicesClientsModule,
    AuthProxyModule,
    UsersProxyModule,
    VenuesProxyModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
