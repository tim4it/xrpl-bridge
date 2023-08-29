import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletTransactionModule } from './wallet.transaction.module';
import { Transaction } from './entity/transaction.entity';
import { Wallet } from './entity/wallet.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'wallet',
      entities: [Transaction, Wallet],
      autoLoadEntities: true,
      synchronize: true,
    }),
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
