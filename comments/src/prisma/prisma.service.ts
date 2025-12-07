import { Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../../prisma/client/client.js';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	public constructor() {
		if (!process.env.DATABASE_URL) throw new Error('Environment variable `DATABASE_URL` is missing');

		super({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
	}

	public async onModuleInit(): Promise<void> {
		await this.$connect();
	}

	public async onModuleDestroy(): Promise<void> {
		await this.$disconnect();
	}
}
