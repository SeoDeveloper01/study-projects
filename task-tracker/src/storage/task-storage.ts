import { readFileSync, type PathLike } from 'node:fs';
import type Task from '../task/task.ts';

export default class TaskStorage {
	public readonly items: Record<Task['id'], Task> = {};
	public readonly path: PathLike;
	public lastItemID: Task['id'] = 0;

	public constructor(path: PathLike) {
		//TODO: use singleton pattern
		try {
			const storage = JSON.parse(readFileSync(path, { encoding: 'utf-8' })) as unknown;

			if (!storage || typeof storage !== 'object' || !('items' in storage) || !('lastItemID' in storage))
				throw new Error('Storage must be an valid object');

			if (this.isItems(storage.items)) this.items = storage.items;
			if (this.isLastItemID(storage.lastItemID)) this.lastItemID = storage.lastItemID;
		} catch {
			this.items = {};
			this.lastItemID = 0;
			console.error('[WARNING] TaskStorage not found or was corrupted. A new TaskStorage will be created.');
		} finally {
			this.path = path;
		}
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
