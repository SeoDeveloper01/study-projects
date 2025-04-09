import type { StatusCode } from './task-status.ts';

export default class Task {
	public readonly id: number;
	public description: string;
	public status: StatusCode;
	public readonly createdAt: EpochTimeStamp;
	public updatedAt: EpochTimeStamp;

	public constructor(id: number, description: string, status: StatusCode, timeStamp: EpochTimeStamp) {
		this.id = id;
		this.description = description;
		this.status = status;
		this.createdAt = timeStamp;
		this.updatedAt = this.createdAt;
	}
}
