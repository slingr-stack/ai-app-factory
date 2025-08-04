import { IsEmail, IsString, MaxLength } from 'class-validator';

export class ContactDto {
  @IsString()
  @MaxLength(100)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MaxLength(15)
  phone!: string;
}
