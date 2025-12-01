import { Injectable } from '@nestjs/common';

import type { CreateCommentDto } from './dto/create-comment.dto.js';
import type { UpdateCommentDto } from './dto/update-comment.dto.js';
import type { CommentWithUser } from './interfaces/comment-with-user.interface.js';

import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CommentService {
	private readonly prisma: PrismaService;

	public constructor(prisma: PrismaService) {
		this.prisma = prisma;
	}

	public async create(userId: string, createCommentDto: CreateCommentDto): Promise<CommentWithUser> {
		return this.prisma.comment.create({
			data: { text: createCommentDto.text, userId },
			include: { user: { omit: { password: true } } }
		});
	}

	public async findAll(): Promise<CommentWithUser[]> {
		return this.prisma.comment.findMany({
			include: { user: { omit: { password: true } } }
		});
	}

	public async findOne(id: string): Promise<CommentWithUser | null> {
		return this.prisma.comment.findUnique({
			where: { id },
			include: { user: { omit: { password: true } } }
		});
	}

	public async update(id: string, updateCommentDto: UpdateCommentDto): Promise<CommentWithUser> {
		return this.prisma.comment.update({
			data: { text: updateCommentDto.text },
			where: { id },
			include: { user: { omit: { password: true } } }
		});
	}

	public async remove(id: string): Promise<CommentWithUser> {
		return this.prisma.comment.delete({
			where: { id },
			include: { user: { omit: { password: true } } }
		});
	}
}
