import { Injectable } from '@nestjs/common';

import type { User } from '../../prisma/client/client.js';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { UpdateUserDto } from './dto/update-user.dto.js';

import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UserService {
	private readonly prisma: PrismaService;

	public constructor(prisma: PrismaService) {
		this.prisma = prisma;
	}

	public async create(createUserDto: CreateUserDto): Promise<User> {
		return this.prisma.user.create({
			data: {
				email: createUserDto.email,
				name: createUserDto.name,
				password: createUserDto.password
			}
		});
	}

	public async findAll(): Promise<User[]> {
		return this.prisma.user.findMany();
	}

	public async findOne(id: string): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: { id }
		});
	}

	public async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
		return this.prisma.user.update({
			where: { id },
			data: {
				email: updateUserDto.email,
				name: updateUserDto.name,
				password: updateUserDto.password
			}
		});
	}

	public async remove(id: string): Promise<User> {
		return this.prisma.user.delete({
			where: { id }
		});
	}
}
