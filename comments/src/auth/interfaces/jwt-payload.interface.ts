import type { User } from '../../../prisma/client/client.js';

export interface JwtPayload {
	sub: User['id'];
	name: User['name'];
}
