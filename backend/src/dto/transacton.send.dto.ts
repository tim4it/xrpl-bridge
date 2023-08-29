import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionSendDto implements Readonly<TransactionSendDto> {
  @ApiProperty({ required: true })
  @IsString()
  transaction_type: string;

  @ApiProperty({ required: true })
  @IsString()
  source: string;

  @ApiProperty({ required: true })
  @IsString()
  destination: string;

  @ApiProperty({ required: true })
  @IsNumber()
  amount: number;
}
