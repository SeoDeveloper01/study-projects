import { Injectable } from '@nestjs/common';

import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';

@Injectable()
export class CommentService {
	public create(createCommentDto: CreateCommentDto): string {
		return 'This action adds a new comment';
	}

	public findAll(): string {
		return `This action returns all comment`;
	}

	public findOne(id: string): string {
		return `This action returns a #${id} comment`;
	}

	public update(id: string, updateCommentDto: UpdateCommentDto): string {
		return `This action updates a #${id} comment`;
	}

	public remove(id: string): string {
		return `This action removes a #${id} comment`;
	}
}
