import { Controller, Get, Post, Body as ReqBody, Patch, Param, Delete } from '@nestjs/common';

import type { CreateUserDto } from './dto/create-user.dto.js';
import type { UpdateUserDto } from './dto/update-user.dto.js';
import type { User } from '../../prisma/client/client.js';

import { UserService } from './user.service.js';

@Controller('user')
export class UserController {
	private readonly userService: UserService;

	public constructor(userService: UserService) {
		this.userService = userService;
	}

	@Post()
	public async create(@ReqBody() createUserDto: CreateUserDto): Promise<User> {
		return this.userService.create(createUserDto);
	}

	@Get()
	public async findAll(): Promise<User[]> {
		return this.userService.findAll();
	}

	@Get(':id')
	public async findOne(@Param('id') id: string): Promise<User | null> {
		return this.userService.findOne(id);
	}

	@Patch(':id')
	public async update(@Param('id') id: string, @ReqBody() updateUserDto: UpdateUserDto): Promise<User> {
		return this.userService.update(id, updateUserDto);
	}

	@Delete(':id')
	public async remove(@Param('id') id: string): Promise<User> {
		return this.userService.remove(id);
	}
}
