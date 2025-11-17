import { Controller, Get, Post, Body as ReqBody, Patch, Param, Delete } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserService } from './user.service.js';

@Controller('user')
export class UserController {
	private readonly userService: UserService;

	public constructor(userService: UserService) {
		this.userService = userService;
	}

	@Post()
	public async create(@ReqBody() createUserDto: CreateUserDto): ReturnType<typeof this.userService.create> {
		return this.userService.create(createUserDto);
	}

	@Get()
	public async findAll(): ReturnType<typeof this.userService.findAll> {
		return this.userService.findAll();
	}

	@Get(':id')
	public async findOne(@Param('id') id: string): ReturnType<typeof this.userService.findOne> {
		return this.userService.findOne(id);
	}

	@Patch(':id')
	public async update(
		@Param('id') id: string,
		@ReqBody() updateUserDto: UpdateUserDto
	): ReturnType<typeof this.userService.update> {
		return this.userService.update(id, updateUserDto);
	}

	@Delete(':id')
	public async remove(@Param('id') id: string): ReturnType<typeof this.userService.remove> {
		return this.userService.remove(id);
	}
}
