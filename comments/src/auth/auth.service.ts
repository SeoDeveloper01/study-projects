import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'node:crypto';

import type { LoginAuthDto } from './dto/login-auth.dto.js';
import type { SignupAuthDto } from './dto/signup-auth.dto.js';
import type { JwtAccessToken } from './interfaces/jwt-access-token.interface.js';
import type { JwtPayload } from './interfaces/jwt-payload.interface.js';

import { UserService } from '../user/user.service.js';

@Injectable()
export class AuthService {
	private readonly userService: UserService;
	private readonly jwtService: JwtService;

	public constructor(userService: UserService, jwtService: JwtService) {
		this.userService = userService;
		this.jwtService = jwtService;
	}

	public async signup(signupAuthDto: SignupAuthDto): Promise<JwtAccessToken> {
		const newUser = await this.userService.create({
			email: signupAuthDto.email,
			name: signupAuthDto.name,
			password: this.getPasswordHash(signupAuthDto.password)
		});

		return this.getAccessToken(newUser.id, newUser.name);
	}

	public async login(loginAuthDto: LoginAuthDto): Promise<JwtAccessToken> {
		const user = await this.userService.findOne(loginAuthDto.name);

		if (!user?.password || user.password !== this.getPasswordHash(loginAuthDto.password)) throw new UnauthorizedException();

		return this.getAccessToken(user.id, user.name);
	}

	private getPasswordHash(password: string): string {
		if (!process.env.SALT) throw new Error('Environment variable `SALT` is missing');

		return hash('sha256', password + process.env.SALT, 'hex');
	}

	private async getAccessToken(sub: string, name: string): Promise<JwtAccessToken> {
		return { accessToken: await this.jwtService.signAsync<JwtPayload>({ sub, name }) };
	}
}
