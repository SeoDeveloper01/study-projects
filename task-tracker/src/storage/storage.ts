import { existsSync, readFileSync, type PathLike } from 'node:fs';
import type Task from '../task/task.ts';

export default class Storage {
	public readonly items: { [itemID: number]: Task } = {};
	public readonly path: PathLike = '';
	public lastItemID: Task['id'] = 0;

	public constructor(path: PathLike) {
		if (existsSync(path)) {
			const storage = JSON.parse(readFileSync(path, { encoding: 'utf-8' })) as this;

			this.items = storage.items ?? {};
			this.lastItemID = storage.lastItemID ?? 0;
		}

		this.path = path;
	}
}
