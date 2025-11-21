import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../user/dto/create-user.dto.js';

export class LoginAuthDto extends PickType(CreateUserDto, ['name', 'password']) {}
