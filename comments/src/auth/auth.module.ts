import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import packageJSON from 'package.json' with { type: 'json' };
import { UserModule } from '../user/user.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

@Module({
	//TODO: make secret private
	imports: [
		UserModule,
		JwtModule.register({
			global: true,
			secret: 'TEMP-SECRET',
			signOptions: { issuer: packageJSON.name, expiresIn: 24 * 60 * 60 }
		})
	],
	controllers: [AuthController],
	providers: [AuthService]
})
export class AuthModule {}
