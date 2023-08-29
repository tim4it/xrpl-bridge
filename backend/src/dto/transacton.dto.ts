import { Transaction } from '../entity/transaction.entity';
import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionDto implements Readonly<TransactionDto> {
  @ApiProperty({ required: true })
  @IsNumber()
  ledger_index: number;

  @ApiProperty({ required: true })
  @IsString()
  ledger_hash: string;

  @ApiProperty({ required: true })
  @IsString()
  account: string;

  @ApiProperty({ required: true })
  @IsString()
  destination: string;

  @ApiProperty({ required: true })
  @IsNumber()
  amount: number;

  @ApiProperty({ required: true })
  @IsNumber()
  fee: number;

  @ApiProperty({ required: true })
  @IsString()
  tx_signature: string;

  @ApiProperty({ required: true })
  @IsNumber()
  date: number;

  public static fromEntity(entity: Transaction) {
    const transactionDto = new TransactionDto();
    transactionDto.ledger_index = entity.ledgerIndex;
    transactionDto.ledger_hash = entity.ledgerHash;
    transactionDto.account = entity.account;
    transactionDto.destination = entity.destination;
    transactionDto.amount = entity.amount;
    transactionDto.fee = entity.fee;
    transactionDto.tx_signature = entity.txSignature;
    transactionDto.date = entity.date;
    return transactionDto;
  }

  public static toEntity(transactionDTO: TransactionDto) {
    const transactionEntity = new Transaction();
    transactionEntity.ledgerIndex = transactionDTO.ledger_index;
    transactionEntity.ledgerHash = transactionDTO.ledger_hash;
    transactionEntity.account = transactionDTO.account;
    transactionEntity.destination = transactionDTO.destination;
    transactionEntity.amount = transactionDTO.amount;
    transactionEntity.fee = transactionDTO.fee;
    transactionEntity.txSignature = transactionDTO.tx_signature;
    transactionEntity.date = transactionDTO.date;
    return transactionEntity;
  }
}
