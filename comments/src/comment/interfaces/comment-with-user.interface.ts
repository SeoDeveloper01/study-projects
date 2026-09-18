import type { Comment as MyComment, User } from '../../../prisma/client/client.js';

export interface CommentWithUser extends MyComment {
	user: Omit<User, 'password'>;
}
