import { Injectable } from '@nestjs/common';
import type { Prisma, User } from '../../prisma/client/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UserService {
	private readonly prisma: PrismaService;

	public constructor(prisma: PrismaService) {
		this.prisma = prisma;
	}

	public async create(createUserDto: Prisma.UserCreateInput): Promise<User> {
		return this.prisma.user.create({ data: createUserDto });
	}

	public async findAll(): Promise<User[]> {
		return this.prisma.user.findMany();
	}

	public async findOne(id: string): Promise<User | null> {
		return this.prisma.user.findUnique({ where: { id } });
	}

	public async update(id: string, updateUserDto: Prisma.UserUpdateInput): Promise<User> {
		return this.prisma.user.update({ where: { id }, data: updateUserDto });
	}

	public async remove(id: string): Promise<User> {
		return this.prisma.user.delete({ where: { id } });
	}
}
