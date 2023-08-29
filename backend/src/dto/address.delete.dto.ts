import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddressDeleteDto implements Readonly<AddressDeleteDto> {
  @ApiProperty({ required: true })
  @IsString()
  address: string;
}
