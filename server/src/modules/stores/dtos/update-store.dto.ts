import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateStoreDTO {
  @IsString()
  @IsNotEmpty({ message: 'A descrição da loja é obrigatória.' })
  description: string;
}
