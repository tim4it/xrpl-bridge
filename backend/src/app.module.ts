import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletTransactionModule } from './wallet.transaction.module';
import { configService } from './config.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    CacheModule.register({
      ttl: 2, // seconds
      max: 15, // maximum number of items in cache
      isGlobal: true,
    }),
    WalletTransactionModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  controllers: [],
})
export class AppModule {}
