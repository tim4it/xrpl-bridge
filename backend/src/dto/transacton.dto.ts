import { Transaction } from '../entity/transaction.entity';
import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionDto implements Readonly<TransactionDto> {
  @ApiProperty({ required: true, description: 'Ledger index' })
  @IsNumber()
  ledger_index: number;

  @ApiProperty({ required: true, description: 'Ledger hash' })
  @IsString()
  ledger_hash: string;

  @ApiProperty({ required: true, description: 'Source wallet address/account' })
  @IsString()
  account: string;

  @ApiProperty({ required: true, description: 'Destination wallet address' })
  @IsString()
  destination: string;

  @ApiProperty({ required: true, description: 'Transfer amount' })
  @IsNumber()
  amount: number;

  @ApiProperty({ required: true, description: 'Transaction fee' })
  @IsNumber()
  fee: number;

  @ApiProperty({ required: true, description: 'Transaction signature' })
  @IsString()
  tx_signature: string;

  @ApiProperty({ required: true, description: 'Transaction date' })
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
