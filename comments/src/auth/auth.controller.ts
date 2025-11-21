import { Controller, Post, Body as ReqBody } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { SignupAuthDto } from './dto/signup-auth.dto.js';
import { LoginAuthDto } from './dto/login-auth.dto.js';

@Controller('auth')
export class AuthController {
	private readonly authService: AuthService;

	public constructor(authService: AuthService) {
		this.authService = authService;
	}

	@Post('signup')
	public async signup(@ReqBody() signupAuthDto: SignupAuthDto): Promise<unknown> {
		return this.authService.signup(signupAuthDto);
	}

	@Post('login')
	public async login(@ReqBody() loginAuthDto: LoginAuthDto): Promise<unknown> {
		return this.authService.login(loginAuthDto);
	}
}
