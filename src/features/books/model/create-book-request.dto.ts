import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateBookDto {
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9가-힝 !@#$%^&*()_+-=,./~<>?'";:\[\]{}|\\]{1,30}$/g)
  @MinLength(1)
  @MaxLength(30)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  description: string;

  @IsOptional()
  @IsUUID()
  coverImageId: string | undefined;
}
