import { readFileSync, type PathLike } from 'node:fs';
import type Task from '../task/task.ts';

export default class Storage {
	public readonly items: { [itemID: number]: Task };
	public readonly path: PathLike;
	public lastItemID: Task['id'];

	public constructor(path: PathLike) {
		try {
			const storage = JSON.parse(readFileSync(path, { encoding: 'utf-8' })) as this;

			this.items = storage.items;
			this.lastItemID = storage.lastItemID;
		} catch {
			this.items = {};
			this.lastItemID = 0;
		} finally {
			this.path = path;
		}
	}
}
