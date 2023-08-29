import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entity/wallet.entity';
import { WalletService } from './wallet/wallet.service';
import { WalletController } from './wallet/wallet.controller';
import { TransactionService } from './transaction/transaction.service';
import { Transaction } from './entity/transaction.entity';
import { TransactionController } from './transaction/transaction.controller';
import { subscribeToAccount } from './monitor.transaction';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Transaction])],
  providers: [WalletService, TransactionService],
  controllers: [WalletController, TransactionController],
})
export class WalletTransactionModule {
  constructor(
    private readonly walletService: WalletService,
    private readonly transactionService: TransactionService,
  ) {
    this.walletService.findAll().then(async (allWallets) => {
      const addresses = allWallets.map((wallet) => wallet.address);
      await subscribeToAccount(addresses, this.transactionService);
    });
  }
}
