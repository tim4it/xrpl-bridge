import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionSendDto implements Readonly<TransactionSendDto> {
  @ApiProperty({ required: true, description: 'Transaction type: Payment,..' })
  @IsString()
  transaction_type: string;

  @ApiProperty({ required: true, description: 'Source wallet address' })
  @IsString()
  source: string;

  @ApiProperty({ required: true, description: 'Destination wallet address' })
  @IsString()
  destination: string;

  @ApiProperty({
    required: true,
    description: 'Amount from source to destination address',
  })
  @IsNumber()
  amount: number;
}
