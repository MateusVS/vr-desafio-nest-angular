import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStoreDTO {
  @IsString()
  @IsNotEmpty()
  description: string;
}
