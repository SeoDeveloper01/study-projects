import { writeFileSync } from 'node:fs';
import type TaskStorage from './task-storage.ts';

export default class TaskStorageManager {
	private readonly storage: TaskStorage;

	public constructor(storage: TaskStorage) {
		this.storage = storage;
	}

	public getStorage(): TaskStorage {
		return this.storage;
	}

	public saveStorage(): void {
		writeFileSync(this.storage.path, JSON.stringify(this.storage));
	}
}
