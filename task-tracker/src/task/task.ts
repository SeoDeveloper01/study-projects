import type { StatusCode } from './task-status.ts';

export interface ITask {
	readonly id: number;
	description: string;
	status: StatusCode;
	readonly createdAt: EpochTimeStamp;
	updatedAt: EpochTimeStamp;
}

export default class CreateTaskDTO implements Omit<ITask, 'id'> {
	public description: string;
	public status: StatusCode;
	public readonly createdAt: EpochTimeStamp;
	public updatedAt: EpochTimeStamp;

	public constructor(description: string, status: StatusCode, timeStamp: EpochTimeStamp) {
		this.description = description;
		this.status = status;
		this.createdAt = timeStamp;
		this.updatedAt = timeStamp;
	}
}
