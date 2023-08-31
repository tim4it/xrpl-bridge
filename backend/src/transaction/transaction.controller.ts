import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { Client, getBalanceChanges, Wallet } from 'xrpl';
import { TransactionService } from './transaction.service';
import { TransactionSendDto } from '../dto/transacton.send.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionAccountDto } from '../dto/transaction.account.dto';
import { WalletService } from '../wallet/wallet.service';
import { Wallet as WalletEntity } from '../entity/wallet.entity';
import { TransactionFilterDto } from '../dto/transaction.filter.dto';
import { TransactionDto } from '../dto/transacton.dto';

@ApiTags('transactions')
@Controller('v1/tx')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(
    private readonly transactionService: TransactionService,
    private readonly walletService: WalletService,
  ) {}

  @Get('all')
  @ApiOperation({ summary: 'Get all transactional information' })
  @ApiResponse({
    status: 200,
    description: 'View all transactions',
    type: TransactionDto,
    isArray: true,
  })
  async getAllTransactions(): Promise<TransactionDto[]> {
    return this.transactionService.findAll();
  }

  @Post('all')
  @ApiOperation({
    summary:
      'Get all filtered transactional information (source or destination)',
  })
  @ApiResponse({
    status: 200,
    description: 'View all filtered transactions',
    type: TransactionDto,
    isArray: true,
  })
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

  @ApiOperation({
    summary:
      'Send transaction amount from source to destination wallet address',
  })
  @ApiResponse({
    status: 200,
    description: 'Send transaction amount',
  })
  @Post('send')
  async send(@Body() body: TransactionSendDto): Promise<any> {
    return this.walletService
      .findByAddress(body.source)
      .then((walletFound) => this.sendData(body, walletFound));
  }

  @ApiOperation({ summary: 'View account information' })
  @ApiResponse({
    status: 200,
    description: 'Account info',
  })
  @Post('account-info')
  async accountInfo(@Body() body: TransactionAccountDto): Promise<any> {
    return this.walletService
      .findByAddress(body.account)
      .then((walletFound) => this.accountInfoData(body, walletFound));
  }

  /**
   * Send transaction amount from source to destination wallet address. Return balance changes
   * @param body body data from {@link TransactionSendDto}
   * @param walletEntity wallet entity {@link WalletEntity}
   * @private
   */
  private async sendData(body: TransactionSendDto, walletEntity: WalletEntity) {
    let client = null;
    try {
      const wallet = Wallet.fromSeed(walletEntity.seed);
      client = new Client(process.env.XRPL_CLIENT);
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
      this.logger.error(`Error processing test wallet data: ${error.data}`);
      return error;
    } finally {
      if (client != null) await client.disconnect();
    }
  }

  /**
   * Get account info data from wallet address/account
   * @param body body data from {@link TransactionAccountDto}
   * @param walletEntity wallet entity {@link WalletEntity}
   * @private
   */
  private async accountInfoData(
    body: TransactionAccountDto,
    walletEntity: WalletEntity,
  ) {
    let client = null;
    try {
      const wallet = Wallet.fromSeed(walletEntity.seed);
      client = new Client(process.env.XRPL_CLIENT);
      await client.connect();

      return await client.request({
        command: 'account_info',
        account: wallet.address,
        ledger_index: 'validated',
      });
    } catch (error) {
      this.logger.log(`Error processing account info data: ${error.data}`);
      throw new NotFoundException(
        `Wallet not found for account seed ${body.account}`,
      );
    } finally {
      if (client != null) await client.disconnect();
    }
  }
}
