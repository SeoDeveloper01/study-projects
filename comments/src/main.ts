import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

process.loadEnvFile();

const app = await NestFactory.create(AppModule);

app.useGlobalPipes(
	new ValidationPipe({
		whitelist: true,
		forbidNonWhitelisted: true,
		forbidUnknownValues: true,
		transform: true
	})
);

await app.listen(process.env.PORT ?? 3000);
