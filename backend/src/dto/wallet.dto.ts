import { Wallet } from '../entity/wallet.entity';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WalletDto implements Readonly<WalletDto> {
  @ApiProperty({ required: true, description: 'Wallet address' })
  @IsString()
  address: string;

  @ApiProperty({ required: true, description: 'Wallet public key' })
  @IsString()
  public_key: string;

  @ApiProperty({ required: true, description: 'Wallet seed' })
  @IsString()
  seed: string;

  public static fromEntity(entity: Wallet): WalletDto {
    const walletDto = new WalletDto();
    walletDto.public_key = entity.publicKey;
    walletDto.address = entity.address;
    walletDto.seed = entity.seed;
    return walletDto;
  }

  public static toEntity(walletDto: WalletDto): Wallet {
    const walletEntity = new Wallet();
    walletEntity.publicKey = walletDto.public_key;
    walletEntity.address = walletDto.address;
    walletEntity.seed = walletDto.seed;
    return walletEntity;
  }
}
