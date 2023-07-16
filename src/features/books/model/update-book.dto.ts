import {IsOptional, IsString, IsUUID, Matches, MaxLength, MinLength} from "class-validator";

export class UpdateBookDto {
  @IsOptional()
  @Matches(/^[A-Za-z0-9가-힝 !@#$%^&*()_+-=,./~<>?'";:\[\]{}|\\]{1,30}$/g)
  @MinLength(1)
  @MaxLength(30)
  title: string | undefined;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  description: string | undefined;

  @IsOptional()
  @IsUUID()
  coverImageId: string | undefined;
}
