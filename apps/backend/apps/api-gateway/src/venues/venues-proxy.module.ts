import { Module } from '@nestjs/common';
import { MicroservicesClientsModule } from '../clients/microservices-clients.module';
import { AuthProxyModule } from '../auth/auth-proxy.module';
import { VenuesProxyController } from './venues-proxy.controller';
import { VenuesProxyService } from './venues-proxy.service';

@Module({
  imports: [MicroservicesClientsModule, AuthProxyModule],
  controllers: [VenuesProxyController],
  providers: [VenuesProxyService],
})
export class VenuesProxyModule {}
