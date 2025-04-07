import type Task from './task.ts';

export default class TaskStorage {
	public readonly tasks: { [taskID: number]: Task } = {};
	public lastID: Task['id'] = 0;
}
