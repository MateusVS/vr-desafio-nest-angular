import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateStoreDTO {
  @IsString()
  @IsNotEmpty()
  description: string;
}
