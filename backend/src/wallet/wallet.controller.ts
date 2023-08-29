import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletDto } from '../dto/wallet.dto';
import { AddressPatchDto } from '../dto/address.patch.dto';
import { AddressDeleteDto } from '../dto/address.delete.dto';
import { Client } from 'xrpl';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionService } from '../transaction/transaction.service';
import { subscribeToAccount } from '../monitor.transaction';

@ApiTags('wallets')
@Controller('v1/wallet')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly transactionService: TransactionService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all wallets with information' })
  @ApiResponse({
    status: 200,
    description: 'View all wallets',
    type: WalletDto,
    isArray: true,
  })
  async getWallets() {
    return this.walletService.findAll();
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create custom wallet' })
  @ApiResponse({
    status: 201,
    description: 'Create custom wallet',
    type: WalletDto,
  })
  async addWallet(@Body() body: WalletDto) {
    return this.walletService.create(body).then(async (added) => {
      await this.findAndSubscribe();
      return WalletDto.fromEntity(added);
    });
  }

  @Patch()
  @HttpCode(204)
  @ApiOperation({
    summary: 'Update existing wallet with new wallet information',
  })
  @ApiResponse({
    status: 204,
    description: 'Update wallet',
    type: WalletDto,
  })
  async updateWallet(@Body() body: AddressPatchDto) {
    return this.walletService.update(body).then(async (updated) => {
      await this.findAndSubscribe();
      return updated;
    });
  }

  @Delete()
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove wallet by wallet address' })
  @ApiResponse({
    status: 204,
    description: 'Delete wallet',
    type: WalletDto,
  })
  async deleteWallet(@Body() body: AddressDeleteDto) {
    return this.walletService.remove(body.address).then(async (removed) => {
      await this.findAndSubscribe();
      return removed;
    });
  }

  @Get('new')
  @ApiOperation({ summary: 'Crete new test wallet in Testnet' })
  @ApiResponse({
    status: 200,
    description: 'Create new test wallet',
    type: WalletDto,
  })
  async newWallet(): Promise<WalletDto> {
    let client = null;
    try {
      client = new Client('wss://s.altnet.rippletest.net:51233');
      await client.connect();
      // create new wallet and send some amount to it
      const createWallet = await client.fundWallet();
      const testWallet = createWallet.wallet;
      // const balance = createWallet.balance;
      const walletDTO = new WalletDto();
      walletDTO.address = testWallet.classicAddress;
      walletDTO.public_key = testWallet.publicKey;
      walletDTO.seed = testWallet.seed;

      return this.walletService
        .create(walletDTO)
        .then(async (walletCreated) => {
          await this.findAndSubscribe();
          return WalletDto.fromEntity(walletCreated);
        });
    } catch (error) {
      return error;
    } finally {
      if (client != null) await client.disconnect();
    }
  }

  /**
   * Find all wallet data addresses and subscribe
   * @private
   */
  private async findAndSubscribe(): Promise<WalletDto[]> {
    return await this.walletService.findAll().then(async (allWallets) => {
      const addresses = allWallets.map((wallet) => wallet.address);
      await subscribeToAccount(addresses, this.transactionService);
      return allWallets;
    });
  }
}
