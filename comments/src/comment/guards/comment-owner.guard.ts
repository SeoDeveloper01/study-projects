import { type CanActivate, type ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import type { RequestWithJwtPayload } from '../../auth/interfaces/req-with-payload.interface.js';
import { CommentService } from '../comment.service.js';

@Injectable()
export class CommentOwnerGuard implements CanActivate {
	private readonly commentService: CommentService;

	public constructor(commentService: CommentService) {
		this.commentService = commentService;
	}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<RequestWithJwtPayload>();
		const commentAuthorId = await this.getCommentAuthorId(request.params.id ?? '');
		const requestSenderId = request.jwtPayload.sub;

		return commentAuthorId === requestSenderId;
	}

	private async getCommentAuthorId(commentId: string): Promise<string> {
		const comment = await this.commentService.findOne(commentId);

		if (!comment) throw new NotFoundException();

		return comment.userId;
	}
}
