import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionFilterDto implements Readonly<TransactionFilterDto> {
  @ApiProperty({ required: true })
  @IsString()
  address: string;

  @ApiProperty({ required: true })
  @IsBoolean()
  isSource: boolean;
}
