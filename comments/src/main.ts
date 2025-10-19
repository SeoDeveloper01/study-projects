import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

const PORT_BY_DEFAULT = 3000;
const app = await NestFactory.create(AppModule);

await app.listen(process.env.PORT ?? PORT_BY_DEFAULT);
