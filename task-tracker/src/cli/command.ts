import type { Interface } from 'node:readline/promises';
import type TaskManager from '../task/task-manager.ts';
import { userManual } from './utils.ts';
import StatusMap, { isStatusKey, statusList } from '../task/task-status.ts';
import type Task from '../task/task.ts';

export default class Command {
	private readonly readlineInterface: Interface;
	private readonly taskManager: TaskManager;

	public constructor(readlineInterface: Interface, taskManager: TaskManager) {
		this.readlineInterface = readlineInterface;
		this.taskManager = taskManager;
	}

	public add(parts: string[]): void {
		const description = parts.slice(1).join(' ');

		if (description.length === 0) throw "Description can't be empty!";
		if (description.length > 128) throw 'Description too long!';

		console.log(`[SUCCESS] Task (ID: ${this.taskManager.add(description).id}) added`);
	}

	public delete(parts: string[]): void {
		const taskID = parseInt(parts[1] ?? '');

		if (isNaN(taskID)) throw 'Task ID must be a valid number!';
		if (!this.taskManager.delete(taskID)) throw `Task (ID: ${taskID}) doesn't exist!`;

		console.log(`[SUCCESS] Task (ID: ${taskID}) deleted`);
	}

	public exit(): void {
		this.readlineInterface.close();
	}

	public help(): void {
		console.log(userManual);
	}

	public list(parts: string[]): void {
		const status = parts[1],
			isValidStatus = status && isStatusKey(status);

		if (status && !isValidStatus) throw `List of available statuses - ${statusList.join(', ')}`;

		const items = this.taskManager.getTaskList(isValidStatus ? StatusMap[status] : undefined);
		const props = new Array<keyof Task>('description', 'status', 'createdAt', 'updatedAt');

		Object.keys(items).length ? console.table(items, props) : console.log('[INFO] The task list is empty');
	}

	public mark(parts: string[]): void {
		const taskID = parseInt(parts[1] ?? '');

		if (isNaN(taskID)) throw 'Task ID must be a valid number!';

		const status = parts[2],
			isValidStatus = status && isStatusKey(status);

		if (!isValidStatus) throw `List of available statuses - ${statusList.join(', ')}`;
		if (!this.taskManager.update(taskID, StatusMap[status])) throw `Task (ID: ${taskID}) doesn't exist!`;

		console.log(`[SUCCESS] Task (ID: ${taskID}) status changed`);
	}

	public update(parts: string[]): void {
		const taskID = parseInt(parts[1] ?? '');

		if (isNaN(taskID)) throw 'Task ID must be a valid number!';

		const description = parts.slice(2).join(' ');

		if (description.length === 0) throw "Description can't be empty!";
		if (description.length > 128) throw 'Description too long!';
		if (!this.taskManager.update(taskID, description)) throw `Task (ID: ${taskID}) doesn't exist!`;

		console.log(`[SUCCESS] Task (ID: ${taskID}) description updated`);
	}
}

export type CommandKey = keyof Command;
