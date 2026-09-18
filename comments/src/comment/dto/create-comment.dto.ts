import { Transform } from 'class-transformer';
import { MinLength } from 'class-validator';

import type { Prisma } from '../../../prisma/client/client.js';

export class CreateCommentDto implements Prisma.CommentCreateWithoutUserInput {
	@Transform(({ value }) => (typeof value === 'string' ? value.trim() : (value as unknown)))
	@MinLength(1)
	public readonly text: string;

	public constructor(text: string) {
		this.text = text;
	}
}
