import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

function resolveMongoUri(config: ConfigService): string {
  const explicitUri = config.get<string>('MONGODB_URI');
  if (explicitUri) {
    return explicitUri;
  }

  const user = config.get<string>('MONGO_USER', 'ef_user');
  const password = config.get<string>('MONGO_PASSWORD', 'ef_password');
  const host = config.get<string>('MONGO_HOST', 'localhost');
  const port = config.get<number>('MONGO_PORT', 27018);
  const db = config.get<string>('MONGO_DB', 'ef_mongo');

  return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${db}?authSource=admin`;
}

@Module({})
export class MongoDatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: MongoDatabaseModule,
      imports: [
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            uri: resolveMongoUri(config),
          }),
        }),
      ],
    };
  }
}
