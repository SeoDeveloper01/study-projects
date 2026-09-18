import { Controller, HttpCode, HttpStatus, Post, Body as ReqBody } from '@nestjs/common';

import { AuthService } from './auth.service.js';
import { LoginAuthDto } from './dto/login-auth.dto.js';
import { SignupAuthDto } from './dto/signup-auth.dto.js';

@Controller('auth')
export class AuthController {
	private readonly authService: AuthService;

	public constructor(authService: AuthService) {
		this.authService = authService;
	}

	@HttpCode(HttpStatus.CREATED)
	@Post('signup')
	public async signup(@ReqBody() signupAuthDto: SignupAuthDto): Promise<unknown> {
		return this.authService.signup(signupAuthDto);
	}

	@HttpCode(HttpStatus.OK)
	@Post('login')
	public async login(@ReqBody() loginAuthDto: LoginAuthDto): Promise<unknown> {
		return this.authService.login(loginAuthDto);
	}
}
