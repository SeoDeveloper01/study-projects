import type Storage from '../storage/storage.ts';
import type Task from './task.ts';

export default class TaskManager {
	private readonly storage: Storage;
	private readonly taskConstructor: typeof Task;

	public constructor(storage: Storage, taskConstructor: typeof Task) {
		this.storage = storage;
		this.taskConstructor = taskConstructor;
	}

	public add(description: Task['description']): Task {
		const task = new this.taskConstructor(++this.storage.lastItemID, description, 0, Date.now());
		this.storage.items[task.id] = task;

		return task;
	}

	public update(taskID: Task['id'], data: Task['description'] | Task['status']): boolean {
		const task = this.storage.items[taskID];

		if (task) {
			typeof data === 'string' ? (task.description = data) : (task.status = data);
			task.updatedAt = Date.now();

			return true;
		}

		return false;
	}

	public delete(taskID: Task['id']): boolean {
		return delete this.storage.items[taskID];
	}

	public getTaskList(status?: Task['status']): Storage['items'] {
		const tasks: Storage['items'] = Object.create(null);
		const timeFormat = Intl.DateTimeFormat(undefined, {
			timeStyle: 'short',
			dateStyle: 'short',
			hour12: false
		});

		for (const taskID in this.storage.items) {
			const task = this.storage.items[taskID]!;

			if (task.status === (status ?? task.status)) {
				tasks[taskID] = Object.assign(Object.create(null), task, {
					createdAt: timeFormat.format(task.createdAt),
					updatedAt: timeFormat.format(task.updatedAt)
				});
			}
		}

		return tasks;
	}

	public logTaskList(items: Storage['items']): void {
		const props = new Array<keyof Task>('description', 'status', 'createdAt', 'updatedAt');

		console.table(items, props);
	}
}
