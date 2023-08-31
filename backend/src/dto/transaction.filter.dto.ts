import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionFilterDto implements Readonly<TransactionFilterDto> {
  @ApiProperty({
    required: true,
    description: 'Source/destination address - depends on isSource',
  })
  @IsString()
  address: string;

  @ApiProperty({
    required: true,
    description: 'If true, take source address, otherwise destination address',
  })
  @IsBoolean()
  isSource: boolean;
}
