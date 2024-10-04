import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStoreDTO {
  @IsString()
  @IsNotEmpty({ message: 'A descrição da loja é obrigatória.' })
  description: string;
}
