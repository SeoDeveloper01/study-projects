import { Injectable } from '@nestjs/common';

import type { User } from '../../prisma/client/client.js';
import type { SignupAuthDto } from './dto/signup-auth.dto.js';
import type { LoginAuthDto } from './dto/login-auth.dto.js';

import { UserService } from '../user/user.service.js';

@Injectable()
export class AuthService {
	private readonly userService: UserService;

	public constructor(userService: UserService) {
		this.userService = userService;
	}

	private getPasswordHash(password: string): string {
		return password;
	}

	public async signup(signupAuthDto: SignupAuthDto): Promise<User> {
		const newUser = await this.userService.create(signupAuthDto);
		return newUser;
	}

	public async login(loginAuthDto: LoginAuthDto): Promise<User | null> {
		const user = await this.userService.findOne(loginAuthDto.name);
		return user;
	}
}
