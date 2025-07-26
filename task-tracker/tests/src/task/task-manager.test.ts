import { ok, partialDeepStrictEqual, strictEqual } from 'node:assert/strict';
import { test, suite, mock, afterEach, beforeEach } from 'node:test';

import type TaskStorage from '../../../src/storage/task-storage.ts';
import Task from '../../../src/task/task.ts';
import TaskManager from '../../../src/task/task-manager.ts';
import StatusMap, { statusList } from '../../../src/task/task-status.ts';

suite('Task Manager', () => {
	const taskStorageMock = {
		items: {},
		path: '',
		lastItemID: 0
	} as TaskStorage;

	const taskConstructorMock = mock.fn(Task);

	const taskManager = new TaskManager(taskStorageMock, taskConstructorMock);

	afterEach(() => {
		for (const taskId of Object.keys(taskStorageMock.items)) {
			delete taskStorageMock.items[+taskId];
		}

		taskConstructorMock.mock.resetCalls();
		taskStorageMock.lastItemID = 0;
	});

	suite('add method', () => {
		test('should create and return new task', () => {
			const timeStamp = Date.now();
			const newTask = taskManager.add('call to mr. John Doe');

			partialDeepStrictEqual(newTask, {
				id: taskStorageMock.lastItemID,
				description: 'call to mr. John Doe',
				status: StatusMap.todo
			} as Task);

			ok(newTask.createdAt === newTask.updatedAt, 'created and updated time initially must be equal');
			ok(newTask.createdAt >= timeStamp, 'created time must be greater or equal to time stamp');
			ok(newTask instanceof Task);
		});

		test('should save new task to taskStorage.items', () => {
			const newTask1 = taskManager.add('call to mr. John Doe');
			const newTask2 = taskManager.add('go for a run');

			strictEqual(taskStorageMock.items[newTask1.id], newTask1);
			strictEqual(taskStorageMock.items[newTask2.id], newTask2);
		});

		test('should increment taskStorage.lastItemID', () => {
			const lastItemIdBeforeAddCall = taskStorageMock.lastItemID;
			const newTask = taskManager.add('call to mr. John Doe');

			strictEqual(taskStorageMock.lastItemID, lastItemIdBeforeAddCall + 1);
			strictEqual(newTask.id, lastItemIdBeforeAddCall + 1);
		});
	});

	suite('update method', () => {
		let newTask: Task;

		beforeEach(() => {
			newTask = taskManager.add('call to mr. John Doe');
		});

		test('should update task description for string input', () => {
			ok(taskManager.update(newTask.id, 'new description'));
			strictEqual(newTask.description, 'new description');
		});

		test('should update task status for number input', () => {
			ok(taskManager.update(newTask.id, StatusMap['in-progress']));
			strictEqual(newTask.status, StatusMap['in-progress']);
		});

		test('should change updated time', () => {
			let timeStamp = Date.now();

			taskManager.update(newTask.id, 'new description');
			ok(newTask.updatedAt >= timeStamp);

			timeStamp = Date.now();

			taskManager.update(newTask.id, StatusMap['in-progress']);
			ok(newTask.updatedAt >= timeStamp);
		});

		test('should return false for unknown task ID', () => {
			ok(!taskManager.update(taskStorageMock.lastItemID + 1, 'new description'));
		});
	});

	suite('delete method', () => {
		let newTask: Task;

		beforeEach(() => {
			newTask = taskManager.add('call to mr. John Doe');
		});

		test('should delete the specified task from Task Storage', () => {
			strictEqual(taskStorageMock.items[newTask.id], newTask);
			taskManager.delete(newTask.id);
			strictEqual(taskStorageMock.items[newTask.id], undefined);
		});

		test('should return true for valid task ID', () => {
			ok(taskManager.delete(newTask.id));
		});

		test('should return false for unknown task ID', () => {
			ok(!taskManager.delete(taskStorageMock.lastItemID + 1));
		});
	});

	suite('getTaskList method', () => {
		beforeEach(() => {
			taskManager.add('first task');
			taskManager.add('second task').status = StatusMap['in-progress'];
			taskManager.add('third task').status = StatusMap.done;
		});

		test('should return all tasks when status not specified', () => {
			const taskList = taskManager.getTaskList();

			ok(Object.keys(taskList).length === Object.keys(taskStorageMock.items).length);

			partialDeepStrictEqual(taskList, {
				1: { id: 1, description: 'first task', status: statusList[StatusMap.todo] },
				2: { id: 2, description: 'second task', status: statusList[StatusMap['in-progress']] },
				3: { id: 3, description: 'third task', status: statusList[StatusMap.done] }
			});
		});

		test('should return only task with specified status', async (testContext) => {
			const testCases = new Array<Promise<void>>();

			for (const status of statusList) {
				testCases.push(
					testContext.test(status, () => {
						for (const task of Object.values(taskManager.getTaskList(StatusMap[status]))) {
							strictEqual(task.status, status);
						}
					})
				);
			}

			await Promise.allSettled(testCases);
		});
	});
});
