import { IsAlphanumeric, IsEmail, IsStrongPassword, Length } from 'class-validator';
import type { Prisma } from '../../../prisma/client/client.js';

export class CreateUserDto implements Prisma.UserCreateInput {
	@IsEmail()
	public readonly email: string;

	@Length(2, 16)
	@IsAlphanumeric()
	public readonly name: string;

	@IsStrongPassword({ minSymbols: 0, minLowercase: 0, minUppercase: 0 })
	public readonly password: string;

	public constructor(email: string, name: string, password: string) {
		this.email = email;
		this.name = name;
		this.password = password;
	}
}
