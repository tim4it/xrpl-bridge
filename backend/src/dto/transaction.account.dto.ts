import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionAccountDto implements Readonly<TransactionAccountDto> {
  @ApiProperty({ required: true })
  @IsString()
  account: string;
}
