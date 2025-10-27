import { IsEmail, IsNotEmpty, IsOptional, IsString, isString, Matches, MinLength } from 'class-validator';

export class SignupDto {
	@IsNotEmpty()
	firstName: string;

	@IsNotEmpty()
	lastName: string;

	@Matches(/^09\d{9}$/, { message: 'Phone number must be a valid Iranian mobile number' })
	phoneNumber: string;

	@IsEmail()
	email: string;

	@MinLength(6)
	password: string;

	@IsOptional()
	@IsString()
	role?: 'user';
}
