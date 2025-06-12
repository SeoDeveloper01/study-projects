import type TaskStorage from '../storage/task-storage.ts';
import StatusMap, { reverseStatusMap } from './task-status.ts';
import type Task from './task.ts';

export default class TaskManager {
	private readonly taskStorage: TaskStorage;
	private readonly taskConstructor: typeof Task;

	public constructor(taskStorage: TaskStorage, taskConstructor: typeof Task) {
		this.taskStorage = taskStorage;
		this.taskConstructor = taskConstructor;
	}

	public add(description: Task['description']): Task {
		const task = new this.taskConstructor(++this.taskStorage.lastItemID, description, StatusMap.todo, Date.now());
		this.taskStorage.items[task.id] = task;

		return task;
	}

	public update(taskID: Task['id'], data: Task['description'] | Task['status']): boolean {
		const task = this.taskStorage.items[taskID];

		if (task) {
			typeof data === 'string' ? (task.description = data) : (task.status = data);
			task.updatedAt = Date.now();

			return true;
		}

		return false;
	}

	public delete(taskID: Task['id']): boolean {
		return Object.hasOwn(this.taskStorage.items, taskID) ? delete this.taskStorage.items[taskID] : false;
	}

	public getTaskList(status?: Task['status']): TaskStorage['items'] {
		const tasks: TaskStorage['items'] = {};
		const timeFormat = Intl.DateTimeFormat(undefined, {
			timeStyle: 'short',
			dateStyle: 'short',
			hour12: false
		});

		for (const task of Object.values(this.taskStorage.items)) {
			if (task.status === (status ?? task.status)) {
				tasks[task.id] = Object.assign({}, task, {
					status: reverseStatusMap[task.status],
					createdAt: timeFormat.format(task.createdAt),
					updatedAt: timeFormat.format(task.updatedAt)
				});
			}
		}

		return tasks;
	}
}
