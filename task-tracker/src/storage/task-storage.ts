import { readFileSync, type PathLike } from 'node:fs';
import type Task from '../task/task.ts';
import message, { prefix } from '../cli/messages.ts';

export default class TaskStorage {
	private static readonly instances = new Map<PathLike, TaskStorage>();
	public readonly items: Record<Task['id'], Task> = {};
	public readonly path: PathLike = 'storage.json';
	public lastItemID: Task['id'] = 0;

	public constructor(path: PathLike) {
		if (!TaskStorage.instances.has(path)) {
			try {
				const storage = JSON.parse(readFileSync(path, { encoding: 'utf-8' })) as unknown;

				if (!storage || typeof storage !== 'object' || !('items' in storage) || !('lastItemID' in storage))
					throw new Error('Storage must be an valid object');

				if (this.isItems(storage.items)) this.items = storage.items;
				if (this.isLastItemID(storage.lastItemID)) this.lastItemID = storage.lastItemID;
			} catch {
				this.items = {};
				this.lastItemID = 0;
				console.error(`${prefix.warning} ${message.storageNotFound}`);
			} finally {
				this.path = path;
				TaskStorage.instances.set(path, this);
			}
		}

		return TaskStorage.instances.get(path) ?? this;
	}

	private isItems(items: unknown): items is typeof this.items {
		if (!items || typeof items !== 'object') throw new Error('Items must be an object');

		for (const [taskID, task] of Object.entries(items)) {
			if (isNaN(parseInt(taskID)) || !task || typeof task !== 'object') throw new Error('Items was corrupted');
		}

		return true;
	}

	private isLastItemID(lastItemID: unknown): lastItemID is typeof this.lastItemID {
		if (typeof lastItemID !== 'number') throw new Error('LastItemID must be a number');

		return true;
	}
}
