import { writeFile } from 'node:fs/promises';
import type Storage from './storage.ts';

export default class StorageManager {
	private readonly storage: Storage;

	public constructor(storage: Storage) {
		this.storage = storage;
	}

	public getStorage(): Storage {
		return this.storage;
	}

	public saveStorage(): void {
		writeFile(this.storage.path, JSON.stringify(this.storage));
	}
}
