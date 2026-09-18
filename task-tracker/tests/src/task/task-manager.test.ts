import { deepStrictEqual, ok, partialDeepStrictEqual, strictEqual } from 'node:assert/strict';
import { unlink } from 'node:fs/promises';
import { DatabaseSync } from 'node:sqlite';
import { after, beforeEach, suite, test } from 'node:test';

import TaskStorage from '../../../src/storage/task-storage.ts';
import TaskManager from '../../../src/task/task-manager.ts';
import StatusMap, { statusList } from '../../../src/task/task-status.ts';
import CreateTaskDTO, { type ITask } from '../../../src/task/task.ts';

suite('Task Manager', () => {
	const PATH_TO_STORAGE = './tests/src/task/storage.db';

	const sqlite = new DatabaseSync(PATH_TO_STORAGE);
	const taskStorage = new TaskStorage(sqlite);
	const taskManager = new TaskManager(taskStorage, CreateTaskDTO);

	const getTaskById = (taskId: ITask['id']): ITask | undefined => {
		const select = sqlite.prepare(`
			SELECT *
			FROM task
			WHERE id = $id	
		`);

		return select.get({ id: taskId }) as unknown as ITask;
	};

	beforeEach(() => {
		sqlite.exec('DELETE FROM task');
	});

	after(() => {
		sqlite.close();
		unlink(PATH_TO_STORAGE);
	});

	suite('add method', () => {
		test('should create and return new task', () => {
			const timeStamp = Date.now();
			const newTask = taskManager.add('call to mr. John Doe');

			partialDeepStrictEqual(newTask, {
				id: 1,
				description: 'call to mr. John Doe',
				status: StatusMap.todo
			});

			ok(newTask.createdAt === newTask.updatedAt, 'created and updated time initially must be equal');
			ok(newTask.createdAt >= timeStamp, 'created time must be greater or equal to time stamp');
		});

		test('should save new task to storage.db', () => {
			const newTask1 = taskManager.add('call to mr. John Doe');
			const newTask2 = taskManager.add('go for a run');

			deepStrictEqual(getTaskById(newTask1.id), newTask1);
			deepStrictEqual(getTaskById(newTask2.id), newTask2);
		});
	});

	suite('update method', () => {
		let newTask: ITask;

		beforeEach(() => {
			newTask = taskManager.add('call to mr. John Doe');
		});

		test('should update task description for string input', () => {
			ok(taskManager.update(newTask.id, 'new description'));
			strictEqual(getTaskById(newTask.id)?.description, 'new description');
		});

		test('should update task status for number input', () => {
			ok(taskManager.update(newTask.id, StatusMap['in-progress']));
			strictEqual(getTaskById(newTask.id)?.status, StatusMap['in-progress']);
		});

		test('should change updated time', () => {
			let timeStamp = Date.now();

			taskManager.update(newTask.id, 'new description');
			ok((getTaskById(newTask.id)?.updatedAt ?? 0) >= timeStamp);

			timeStamp = Date.now();

			taskManager.update(newTask.id, StatusMap['in-progress']);
			ok((getTaskById(newTask.id)?.updatedAt ?? 0) >= timeStamp);
		});

		test('should return false for unknown task ID', () => {
			ok(!taskManager.update(newTask.id + 1, 'new description'));
		});
	});

	suite('delete method', () => {
		let newTask: ITask;

		beforeEach(() => {
			newTask = taskManager.add('call to mr. John Doe');
		});

		test('should delete the specified task from Task Storage', () => {
			deepStrictEqual(getTaskById(newTask.id), newTask, 'must exist before deletion');
			taskManager.delete(newTask.id);
			strictEqual(getTaskById(newTask.id), undefined);
		});

		test('should return true for valid task ID', () => {
			ok(taskManager.delete(newTask.id));
		});

		test('should return false for unknown task ID', () => {
			ok(!taskManager.delete(newTask.id + 1));
		});
	});

	suite('getTaskList method', () => {
		let newTask1: ITask, newTask2: ITask, newTask3: ITask;

		beforeEach(() => {
			newTask1 = taskManager.add('first task');
			newTask2 = taskManager.add('second task');
			newTask3 = taskManager.add('third task');

			taskManager.update(newTask2.id, StatusMap['in-progress']);
			taskManager.update(newTask3.id, StatusMap.done);
		});

		test('should return all tasks when status not specified', () => {
			const taskList = taskManager.getTaskList();

			ok(Object.keys(taskList).length === 3);

			partialDeepStrictEqual(taskList, {
				[newTask1.id]: {
					id: newTask1.id,
					description: 'first task',
					status: statusList[StatusMap.todo]
				},
				[newTask2.id]: {
					id: newTask2.id,
					description: 'second task',
					status: statusList[StatusMap['in-progress']]
				},
				[newTask3.id]: {
					id: newTask3.id,
					description: 'third task',
					status: statusList[StatusMap.done]
				}
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
