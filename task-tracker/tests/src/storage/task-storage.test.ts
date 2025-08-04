import { deepStrictEqual, ok, strictEqual } from 'node:assert/strict';
import { test, suite, mock } from 'node:test';
import { unlink } from 'node:fs/promises';

import TaskStorage from '../../../src/storage/task-storage.ts';
import TaskStorageManager from '../../../src/storage/task-storage-manager.ts';
import { partialDeepStrictEqual } from 'node:assert';

suite('Task Storage Constructor', () => {
	mock.method(console, 'error', () => undefined);

	const taskStoragePath = './tests/storage.json';
	const taskStorage = new TaskStorage(taskStoragePath);

	test('new Task Storage instance should be created', () => {
		ok(taskStorage instanceof TaskStorage);
	});

	test('should correctly assign all properties', () => {
		deepStrictEqual(taskStorage.items, {});
		strictEqual(taskStorage.lastItemID, 0);
		strictEqual(taskStorage.path, taskStoragePath);
	});

	test('should return same instance for same path', () => {
		strictEqual(new TaskStorage(taskStoragePath), taskStorage);
	});

	test('should correctly restore storage from disc', (testContext) => {
		const taskStorageNewPath = './tests/new-storage.json';
		const taskStorageNew = {
			items: {},
			path: taskStorageNewPath,
			lastItemID: 0
		} as TaskStorage;

		testContext.after(() => {
			unlink(taskStorageNewPath);
		});

		new TaskStorageManager(taskStorageNew).saveStorage();
		partialDeepStrictEqual(new TaskStorage(taskStorageNewPath), taskStorageNew);
	});

	test('should create new storage if saved copy was corrupted', (testContext) => {
		const taskStorageCorruptedPath = './tests/corrupted-storage.json';
		const taskStorageCorrupted = { path: taskStorageCorruptedPath } as TaskStorage;

		testContext.after(() => {
			unlink(taskStorageCorruptedPath);
		});

		new TaskStorageManager(taskStorageCorrupted).saveStorage();

		const newTaskStorage = new TaskStorage(taskStorageCorruptedPath);

		deepStrictEqual(newTaskStorage.items, {});
		strictEqual(newTaskStorage.lastItemID, 0);
		strictEqual(newTaskStorage.path, taskStorageCorruptedPath);
	});
});
