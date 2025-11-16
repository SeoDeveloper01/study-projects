import type { Prisma } from '../../../prisma/client/client.js';

export class CreateUserDto implements Prisma.UserCreateInput {
	public readonly email: string;
	public readonly name: string;
	public readonly password: string;

	public constructor(email: string, name: string, password: string) {
		this.email = email;
		this.name = name;
		this.password = password;
	}
}
