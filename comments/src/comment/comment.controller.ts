import { Controller, Delete, Get, Param, Patch, Post, Body as ReqBody } from '@nestjs/common';

import { CommentService } from './comment.service.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';

@Controller('comment')
export class CommentController {
	private readonly commentService: CommentService;

	public constructor(commentService: CommentService) {
		this.commentService = commentService;
	}

	@Post()
	public create(@ReqBody() createCommentDto: CreateCommentDto): string {
		return this.commentService.create(createCommentDto);
	}

	@Get()
	public findAll(): string {
		return this.commentService.findAll();
	}

	@Get(':id')
	public findOne(@Param('id') id: string): string {
		return this.commentService.findOne(id);
	}

	@Patch(':id')
	public update(@Param('id') id: string, @ReqBody() updateCommentDto: UpdateCommentDto): string {
		return this.commentService.update(id, updateCommentDto);
	}

	@Delete(':id')
	public remove(@Param('id') id: string): string {
		return this.commentService.remove(id);
	}
}
