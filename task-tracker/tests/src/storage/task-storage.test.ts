import { deepStrictEqual, ok, strictEqual } from 'node:assert/strict';
import { unlink, writeFile } from 'node:fs/promises';
import { DatabaseSync } from 'node:sqlite';
import { after, mock, suite, test } from 'node:test';

import TaskStorage from '../../../src/storage/task-storage.ts';

suite('Task Storage', () => {
	const PATH_TO_STORAGE = './tests/src/storage/storage.db';
	const sqlite = new DatabaseSync(PATH_TO_STORAGE);
	const taskStorage = new TaskStorage(sqlite);

	mock.method(console, 'error', () => undefined);

	after(() => {
		sqlite.close();
		unlink(PATH_TO_STORAGE);
	});

	test('new Task Storage instance should be created', () => {
		ok(taskStorage instanceof TaskStorage);
	});

	test('should return same instance for DB with same path', () => {
		strictEqual(new TaskStorage(sqlite), taskStorage);
	});

	test('should create new storage if saved copy was corrupted', async (testContext) => {
		const PATH_TO_CORRUPTED_STORAGE = './tests/src/storage/corrupted-storage.db';
		const newSqlite = new DatabaseSync(PATH_TO_CORRUPTED_STORAGE);

		testContext.after(() => {
			newSqlite.close();
			unlink(PATH_TO_CORRUPTED_STORAGE);
		});

		await writeFile(PATH_TO_CORRUPTED_STORAGE, 'Lorem Ipsum...');

		deepStrictEqual(new TaskStorage(newSqlite).findAll(), []);
	});
});
