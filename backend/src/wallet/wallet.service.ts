import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from '../entity/wallet.entity';
import { Repository } from 'typeorm';
import { WalletDto } from '../dto/wallet.dto';
import { AddressPatchDto } from '../dto/address.patch.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async create(wallet: WalletDto): Promise<Wallet> {
    return this.walletRepository.save(WalletDto.toEntity(wallet));
  }
  async update(wallet: AddressPatchDto): Promise<WalletDto> {
    return this.findByAddress(wallet.current_address).then(
      async (walletToUpdate) => {
        walletToUpdate.address = wallet.new_address;
        walletToUpdate.seed = wallet.new_seed;
        return await this.walletRepository
          .save(walletToUpdate)
          .then((walletSaved) => WalletDto.fromEntity(walletSaved));
      },
    );
  }

  async findAll(): Promise<WalletDto[]> {
    return await this.walletRepository
      .find()
      .then((wallets) => wallets.map((wallet) => WalletDto.fromEntity(wallet)));
  }

  async findByAddress(addressFind: string): Promise<Wallet | null> {
    return this.walletRepository
      .findOneBy({ address: addressFind })
      .then((walletFound) => {
        if (walletFound == null)
          throw new NotFoundException(
            `Provided wallet address '${addressFind}' can't be found`,
          );
        return walletFound;
      });
  }

  async remove(address: string): Promise<WalletDto> {
    return this.findByAddress(address).then(async (walletToRemove) => {
      return await this.walletRepository
        .delete(walletToRemove.id)
        .then(() => WalletDto.fromEntity(walletToRemove));
    });
  }
}
