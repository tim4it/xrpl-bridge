import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddressPatchDto implements Readonly<AddressPatchDto> {
  @ApiProperty({ required: true, description: 'Current wallet address' })
  @IsString()
  current_address: string;

  @ApiProperty({ required: true, description: 'New wallet address' })
  @IsString()
  new_address: string;

  @ApiProperty({ required: true, description: 'New wallet address seed' })
  @IsString()
  new_seed: string;
}
