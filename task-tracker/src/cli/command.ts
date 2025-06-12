import type { Interface } from 'node:readline/promises';
import type TaskManager from '../task/task-manager.ts';
import { commandSchema, userManual } from './utils.ts';
import StatusMap, { isStatusKey, statusList } from '../task/task-status.ts';
import type Task from '../task/task.ts';

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

		if (description.length < this.MIN_DESCIPTION_LENGTH) throw new Error("Description can't be empty!");
		if (description.length > this.MAX_DESCIPTION_LENGTH) throw new Error('Description too long!');

		console.log(`[SUCCESS] Task (ID: ${this.taskManager.add(description).id.toString()}) added`);
	}

	public delete(parts: string[]): void {
		const taskID = parseInt(parts[commandSchema.taskID] ?? '');

		if (isNaN(taskID)) throw new Error('Task ID must be a valid number!');
		if (!this.taskManager.delete(taskID)) throw new Error(`Task (ID: ${taskID.toString()}) doesn't exist!`);

		console.log(`[SUCCESS] Task (ID: ${taskID.toString()}) deleted`);
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

		if (status && !isValidStatus) throw new Error(`List of available statuses - ${statusList.join(', ')}`);

		const items = this.taskManager.getTaskList(isValidStatus ? StatusMap[status] : undefined);
		const props = new Array<keyof Task>('description', 'status', 'createdAt', 'updatedAt');

		Object.keys(items).length ? console.table(items, props) : console.log('[INFO] The task list is empty');
	}

	public mark(parts: string[]): void {
		const taskID = parseInt(parts[commandSchema.taskID] ?? '');

		if (isNaN(taskID)) throw new Error('Task ID must be a valid number!');

		const status = parts[commandSchema.statusMark],
			isValidStatus = status && isStatusKey(status);

		if (!isValidStatus) throw new Error(`List of available statuses - ${statusList.join(', ')}`);
		if (!this.taskManager.update(taskID, StatusMap[status]))
			throw new Error(`Task (ID: ${taskID.toString()}) doesn't exist!`);

		console.log(`[SUCCESS] Task (ID: ${taskID.toString()}) status changed`);
	}

	public update(parts: string[]): void {
		const taskID = parseInt(parts[commandSchema.taskID] ?? '');

		if (isNaN(taskID)) throw new Error('Task ID must be a valid number!');

		const description = parts.slice(commandSchema.descriptionUpd).join(' ');

		if (description.length < this.MIN_DESCIPTION_LENGTH) throw new Error("Description can't be empty!");
		if (description.length > this.MAX_DESCIPTION_LENGTH) throw new Error('Description too long!');
		if (!this.taskManager.update(taskID, description)) throw new Error(`Task (ID: ${taskID.toString()}) doesn't exist!`);

		console.log(`[SUCCESS] Task (ID: ${taskID.toString()}) description updated`);
	}
}

export type CommandKey = keyof Command;
