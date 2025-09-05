import { ok, partialDeepStrictEqual, strictEqual } from 'node:assert/strict';
import { test, suite, afterEach } from 'node:test';
import { unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';

import TaskStorageManager from '../../../src/storage/task-storage-manager.ts';
import TaskStorage from '../../../src/storage/task-storage.ts';

suite('Task Storage Manager', () => {
	const taskStorageMock = {
		items: {},
		path: './tests/storage.json',
		lastItemID: 0
	} as TaskStorage;

	const taskStorageManager = new TaskStorageManager(taskStorageMock);

	suite('getStorage method', () => {
		test('should return task storage', () => {
			strictEqual(taskStorageManager.getStorage(), taskStorageMock);
		});
	});

	suite('saveStorage method', () => {
		afterEach(() => {
			unlink(taskStorageMock.path);
		});

		test('should save task storage to disc', () => {
			taskStorageManager.saveStorage();
			ok(existsSync(taskStorageMock.path));
		});

		test('original and saved task storage should be equal', () => {
			taskStorageManager.saveStorage();
			partialDeepStrictEqual(new TaskStorage(taskStorageMock.path), taskStorageMock);
		});
	});
});
