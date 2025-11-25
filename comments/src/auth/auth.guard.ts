import { type CanActivate, type ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import type { Request as expressRequest } from 'express';
import type { JwtPayload } from './interfaces/jwt-payload.interface.js';

@Injectable()
export class AuthGuard implements CanActivate {
	private readonly jwtService: JwtService;

	public constructor(jwtService: JwtService) {
		this.jwtService = jwtService;
	}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<expressRequest>();
		const token = this.extractTokenFromHeader(request);

		if (!token) throw new UnauthorizedException();

		try {
			Object.assign(request, { jwtPayload: await this.jwtService.verifyAsync<JwtPayload>(token) });
		} catch {
			throw new UnauthorizedException();
		}

		return true;
	}

	private extractTokenFromHeader(request: expressRequest): string | undefined {
		const { '0': type, '1': token } = request.headers.authorization?.split(' ', 2) ?? [];

		return type === 'Bearer' ? token : undefined;
	}
}
