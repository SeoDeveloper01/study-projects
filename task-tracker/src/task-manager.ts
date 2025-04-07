import type TaskStorage from './task-storage.ts';
import type Task from './task.ts';

export default class TaskManager {
	private readonly storage: TaskStorage;
	private readonly taskConstructor: typeof Task;

	public constructor(storage: TaskStorage, taskConstructor: typeof Task) {
		this.storage = storage;
		this.taskConstructor = taskConstructor;
	}

	public add(description: Task['description']): Task {
		const task = new this.taskConstructor(++this.storage.lastID, description, 0, Date.now());
		this.storage.tasks[task.id] = task;

		return task;
	}

	public update(taskID: Task['id'], data: Task['description'] | Task['status']): boolean {
		const task = this.storage.tasks[taskID];

		if (task) {
			typeof data === 'string' ? (task.description = data) : (task.status = data);
			task.updatedAt = Date.now();

			return true;
		}

		return false;
	}

	public delete(taskID: Task['id']): boolean {
		return delete this.storage.tasks[taskID];
	}

	public getTaskList(status?: Task['status']): Task[] {
		const tasks = new Array<Task>();

		for (const taskID in this.storage.tasks) {
			const task = this.storage.tasks[taskID]!;
			if (task.status === (status ?? task.status)) tasks.push(task);
		}

		return tasks;
	}
}
