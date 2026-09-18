import { writeFileSync, type PathLike } from 'node:fs';
import type { DatabaseSync, StatementSync } from 'node:sqlite';

import message, { prefix } from '../cli/messages.ts';
import type { ITask } from '../task/task.ts';
import query from './task-storage-queries.ts';

export default class TaskStorage {
	private static readonly instances = new Map<PathLike, TaskStorage>();

	private readonly findAllStatement!: StatementSync;
	private readonly findStatement!: StatementSync;
	private readonly createStatement!: StatementSync;
	private readonly updateDescriptionStatement!: StatementSync;
	private readonly updateStatusStatement!: StatementSync;
	private readonly deleteStatement!: StatementSync;

	public constructor(db: DatabaseSync) {
		const path = db.location() ?? ':memory:';
		const storage = TaskStorage.instances.get(path);

		if (storage) return storage;

		try {
			db.exec(query.CREATE_TABLE);
		} catch (error) {
			if (Error.isError(error) && 'code' in error && error.code === 'ERR_SQLITE_ERROR')
				console.error(`${prefix.warning} ${message.storageCorrupted}`);

			if (path !== ':memory:') writeFileSync(path, '');

			db.exec(query.CREATE_TABLE);
		} finally {
			this.findAllStatement = db.prepare(query.SELECT_ALL);
			this.findStatement = db.prepare(query.SELECT);
			this.createStatement = db.prepare(query.INSERT);
			this.updateDescriptionStatement = db.prepare(query.UPDATE_DESCRIPTION);
			this.updateStatusStatement = db.prepare(query.UPDATE_STATUS);
			this.deleteStatement = db.prepare(query.DELETE);

			TaskStorage.instances.set(path, this);
		}
	}

	public findAll(): ITask[] {
		return this.findAllStatement.all() as unknown as ITask[];
	}

	public find(status: ITask['status']): ITask[] {
		return this.findStatement.all({ status }) as unknown as ITask[];
	}

	public create(data: Omit<ITask, 'id'>): ITask {
		return this.createStatement.get(data) as unknown as ITask;
	}

	public updateDescription(data: Pick<ITask, 'id' | 'description' | 'updatedAt'>): boolean {
		return Boolean(this.updateDescriptionStatement.run(data).changes);
	}

	public updateStatus(data: Pick<ITask, 'id' | 'status' | 'updatedAt'>): boolean {
		return Boolean(this.updateStatusStatement.run(data).changes);
	}

	public delete(id: ITask['id']): boolean {
		return Boolean(this.deleteStatement.run({ id }).changes);
	}
}
