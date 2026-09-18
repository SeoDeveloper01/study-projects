import { Controller, Delete, Param, Patch, Post, Req, Body as ReqBody, UseGuards } from '@nestjs/common';

import type { RequestWithJwtPayload } from '../auth/interfaces/req-with-payload.interface.js';
import type { CommentWithUser } from './interfaces/comment-with-user.interface.js';

import { AuthGuard } from '../auth/guards/auth.guard.js';
import { CommentService } from './comment.service.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';
import { CommentOwnerGuard } from './guards/comment-owner.guard.js';

@Controller('comment')
@UseGuards(AuthGuard)
export class CommentController {
	private readonly commentService: CommentService;

	public constructor(commentService: CommentService) {
		this.commentService = commentService;
	}

	@Post()
	public async create(
		@ReqBody() createCommentDto: CreateCommentDto,
		@Req() { jwtPayload }: RequestWithJwtPayload
	): Promise<CommentWithUser> {
		return this.commentService.create(jwtPayload.sub, createCommentDto);
	}

	@Patch(':id')
	@UseGuards(CommentOwnerGuard)
	public async update(@Param('id') id: string, @ReqBody() updateCommentDto: UpdateCommentDto): Promise<CommentWithUser> {
		return this.commentService.update(id, updateCommentDto);
	}

	@Delete(':id')
	@UseGuards(CommentOwnerGuard)
	public async remove(@Param('id') id: string): Promise<CommentWithUser> {
		return this.commentService.remove(id);
	}
}
