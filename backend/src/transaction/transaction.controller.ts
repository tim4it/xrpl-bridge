import { Body, Controller, Get, NotFoundException, Post } from '@nestjs/common';
import { Client, getBalanceChanges, Wallet } from 'xrpl';
import { TransactionService } from './transaction.service';
import { TransactionSendDto } from '../dto/transacton.send.dto';
import { ApiTags } from '@nestjs/swagger';
import { TransactionAccountDto } from '../dto/transaction.account.dto';
import { WalletService } from '../wallet/wallet.service';
import { Wallet as WalletEntity } from '../entity/wallet.entity';
import { TransactionFilterDto } from '../dto/transaction.filter.dto';
import { TransactionDto } from '../dto/transacton.dto';

@ApiTags('transactions')
@Controller('v1/tx')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly walletService: WalletService,
  ) {}

  @Get('all')
  async getAllTransactions(): Promise<TransactionDto[]> {
    return this.transactionService.findAll();
  }

  @Post('all')
  async getFilteredTransactions(
    @Body() body: TransactionFilterDto,
  ): Promise<TransactionDto[]> {
    return this.transactionService
      .findByTransactionAddress(body.address, body.isSource)
      .then((transactions) =>
        transactions.map((transaction) =>
          TransactionDto.fromEntity(transaction),
        ),
      );
  }

  @Post('send')
  async send(@Body() body: TransactionSendDto): Promise<any> {
    return this.walletService
      .findByAddress(body.source)
      .then((walletFound) => this.sendData(body, walletFound));
  }

  @Post('account-info')
  async accountInfo(@Body() body: TransactionAccountDto): Promise<any> {
    return this.walletService
      .findByAddress(body.account)
      .then((walletFound) => this.accountInfoData(body, walletFound));
  }

  private async sendData(body: TransactionSendDto, walletEntity: WalletEntity) {
    let client = null;
    try {
      const wallet = Wallet.fromSeed(walletEntity.seed);
      client = new Client('wss://s.altnet.rippletest.net:51233');
      await client.connect();
      // Prepare transaction
      const transactionData = {
        TransactionType: body.transaction_type,
        Account: wallet.classicAddress,
        Destination: body.destination,
        Amount: body.amount.toString(),
      };
      const prepared = await client.autofill(transactionData);
      // Sign prepared instructions
      const signed = wallet.sign(prepared);
      // Submit signed blob
      const tx = await client.submitAndWait(signed.tx_blob);
      // Check transaction results
      return JSON.stringify(getBalanceChanges(tx.result.meta), null, 2);
    } catch (error) {
      console.log(error);
      return error;
    } finally {
      if (client != null) await client.disconnect();
    }
  }

  private async accountInfoData(
    body: TransactionAccountDto,
    walletEntity: WalletEntity,
  ) {
    let client = null;
    try {
      const wallet = Wallet.fromSeed(walletEntity.seed);
      client = new Client('wss://s.altnet.rippletest.net:51233');
      await client.connect();

      return await client.request({
        command: 'account_info',
        account: wallet.address,
        ledger_index: 'validated',
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException(
        `Wallet not found for account seed ${body.account}`,
      );
    } finally {
      if (client != null) await client.disconnect();
    }
  }
}
