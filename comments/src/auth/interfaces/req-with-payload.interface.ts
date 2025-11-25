import type { Request as expressRequest } from 'express';
import type { JwtPayload } from './jwt-payload.interface.js';

export interface RequestWithJwtPayload extends expressRequest {
	jwtPayload: JwtPayload;
}
