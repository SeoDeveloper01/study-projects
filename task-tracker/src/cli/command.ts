import type { Interface } from 'node:readline/promises';
import { format } from 'node:util';

import type Task from '../task/task.ts';
import type TaskManager from '../task/task-manager.ts';

import StatusMap, { isStatusKey } from '../task/task-status.ts';
import message, { prefix, userManual } from './messages.ts';
import { commandSchema } from './utils.ts';

export default class Command {
	private readonly MIN_DESCIPTION_LENGTH = 1;
	private readonly MAX_DESCIPTION_LENGTH = 128;
	private readonly readlineInterface: Interface;
	private readonly taskManager: TaskManager;

	public constructor(readlineInterface: Interface, taskManager: TaskManager) {
		this.readlineInterface = readlineInterface;
		this.taskManager = taskManager;
	}

	public add(parts: string[]): void {
		const description = parts.slice(commandSchema.descriptionAdd).join(' ');

		if (description.length < this.MIN_DESCIPTION_LENGTH) throw new Error(message.taskDescriptionEmpty);
		if (description.length > this.MAX_DESCIPTION_LENGTH) throw new Error(message.taskDescriptionLong);

		console.log(`${prefix.success} ${message.taskAdded}`, this.taskManager.add(description).id);
	}

	public delete(parts: string[]): void {
		const taskID = parseInt(parts[commandSchema.taskID] ?? '');

		if (isNaN(taskID)) throw new Error(message.taskIdInvalid);
		if (!this.taskManager.delete(taskID)) throw new Error(format(message.taskIdUnknown, taskID));

		console.log(`${prefix.success} ${message.taskDeleted}`, taskID);
	}

	public exit(): void {
		this.readlineInterface.close();
	}

	public help(): void {
		console.log(userManual);
	}

	public list(parts: string[]): void {
		const status = parts[commandSchema.statusList],
			isValidStatus = status && isStatusKey(status);

		if (status && !isValidStatus) throw new Error(message.availableStatuses);

		const items = this.taskManager.getTaskList(isValidStatus ? StatusMap[status] : undefined);
		const props = new Array<keyof Task>('description', 'status', 'createdAt', 'updatedAt');

		Object.keys(items).length ? console.table(items, props) : console.log(`${prefix.info} ${message.taskListEmpty}`);
	}

	public mark(parts: string[]): void {
		const taskID = parseInt(parts[commandSchema.taskID] ?? '');

		if (isNaN(taskID)) throw new Error(message.taskIdInvalid);

		const status = parts[commandSchema.statusMark],
			isValidStatus = status && isStatusKey(status);

		if (!isValidStatus) throw new Error(message.availableStatuses);
		if (!this.taskManager.update(taskID, StatusMap[status])) throw new Error(format(message.taskIdUnknown, taskID));

		console.log(`${prefix.success} ${message.taskStatusChanged}`, taskID);
	}

	public update(parts: string[]): void {
		const taskID = parseInt(parts[commandSchema.taskID] ?? '');

		if (isNaN(taskID)) throw new Error(message.taskIdInvalid);

		const description = parts.slice(commandSchema.descriptionUpd).join(' ');

		if (description.length < this.MIN_DESCIPTION_LENGTH) throw new Error(message.taskDescriptionEmpty);
		if (description.length > this.MAX_DESCIPTION_LENGTH) throw new Error(message.taskDescriptionLong);
		if (!this.taskManager.update(taskID, description)) throw new Error(format(message.taskIdUnknown, taskID));

		console.log(`${prefix.success} ${message.taskDescriptionUpdated}`, taskID);
	}
}

export type CommandKey = keyof Command;
