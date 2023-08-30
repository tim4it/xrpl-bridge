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
  async getWallets(): Promise<WalletDto[]> {
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
  async addWallet(@Body() body: WalletDto): Promise<WalletDto> {
    return this.walletService.create(body).then(async (added) => {
      return await this.findAndSubscribe().then(() => {
        return WalletDto.fromEntity(added);
      });
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
  async updateWallet(@Body() body: AddressPatchDto): Promise<WalletDto> {
    return this.walletService.update(body).then(async (updated) => {
      return await this.findAndSubscribe().then(() => updated);
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
  async deleteWallet(@Body() body: AddressDeleteDto): Promise<WalletDto> {
    return this.walletService.remove(body.address).then(async (removed) => {
      return await this.findAndSubscribe().then(() => removed);
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
      client = new Client(process.env.XRPL_CLIENT);
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
          return await this.findAndSubscribe().then(() =>
            WalletDto.fromEntity(walletCreated),
          );
        });
    } catch (error) {
      return error;
    } finally {
      if (client != null) await client.disconnect();
    }
  }

  /**
   * Find all wallet data addresses and subscribe for monitoring functionality
   * @private
   */
  private async findAndSubscribe(): Promise<WalletDto[]> {
    return await this.walletService.findAll().then(async (allWallets) => {
      const addresses = allWallets.map((wallet) => wallet.address);
      return await subscribeToAccount(addresses, this.transactionService).then(
        () => allWallets,
      );
    });
  }
}
