import type TaskStorage from '../storage/task-storage.ts';

import StatusMap, { reverseStatusMap } from './task-status.ts';
import type CreateTaskDTO from './task.ts';
import type { ITask } from './task.ts';

export default class TaskManager {
	private readonly taskStorage: TaskStorage;
	private readonly createTaskDTO: typeof CreateTaskDTO;

	public constructor(taskStorage: TaskStorage, createTaskDTO: typeof CreateTaskDTO) {
		this.taskStorage = taskStorage;
		this.createTaskDTO = createTaskDTO;
	}

	public add(description: ITask['description']): ITask {
		const taskDTO = new this.createTaskDTO(description, StatusMap.todo, Date.now());
		const task = this.taskStorage.create(taskDTO);

		return task;
	}

	public update(taskID: ITask['id'], data: ITask['description'] | ITask['status']): boolean {
		return typeof data === 'string'
			? this.taskStorage.updateDescription({ id: taskID, description: data, updatedAt: Date.now() })
			: this.taskStorage.updateStatus({ id: taskID, status: data, updatedAt: Date.now() });
	}

	public delete(taskID: ITask['id']): boolean {
		return this.taskStorage.delete(taskID);
	}

	public getTaskList(status?: ITask['status']): Record<ITask['id'], ITask> {
		const tasks: Record<ITask['id'], ITask> = {};
		const timeFormat = Intl.DateTimeFormat(undefined, {
			timeStyle: 'short',
			dateStyle: 'short',
			hour12: false
		});

		for (const task of status === undefined ? this.taskStorage.findAll() : this.taskStorage.find(status)) {
			tasks[task.id] = Object.assign({}, task, {
				status: reverseStatusMap[task.status],
				createdAt: timeFormat.format(task.createdAt),
				updatedAt: timeFormat.format(task.updatedAt)
			});
		}

		return tasks;
	}
}
