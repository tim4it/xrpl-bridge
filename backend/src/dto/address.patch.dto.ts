import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddressPatchDto implements Readonly<AddressPatchDto> {
  @ApiProperty({ required: true })
  @IsString()
  old_address: string;

  @ApiProperty({ required: true })
  @IsString()
  new_address: string;

  @ApiProperty({ required: true })
  @IsString()
  new_seed: string;
}
