import { readFileSync, type PathLike } from 'node:fs';
import { isNativeError } from 'node:util/types';

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

				this.assertIsStorage(storage);

				this.items = storage.items;
				this.lastItemID = storage.lastItemID;
			} catch (error) {
				if (!(isNativeError(error) && 'code' in error && error.code === 'ENOENT'))
					console.error(`${prefix.warning} ${message.storageCorrupted}`);

				this.items = {};
				this.lastItemID = 0;
			} finally {
				this.path = path;
				TaskStorage.instances.set(path, this);
			}
		}

		return TaskStorage.instances.get(path) ?? this;
	}

	private assertIsStorage(storage: unknown): asserts storage is this {
		if (!storage || typeof storage !== 'object' || !('items' in storage) || !('lastItemID' in storage))
			throw new Error('Storage must be an valid object');

		if (!storage.items || typeof storage.items !== 'object') throw new Error('Items must be an object');

		for (const [taskID, task] of Object.entries(storage.items)) {
			if (isNaN(parseInt(taskID)) || !task || typeof task !== 'object') throw new Error('Items was corrupted');
		}

		if (typeof storage.lastItemID !== 'number') throw new Error('LastItemID must be a number');
	}
}
