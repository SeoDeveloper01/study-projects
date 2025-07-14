import { ok, strictEqual } from 'node:assert/strict';
import { test, suite } from 'node:test';

import Task from '../../../src/task/task.ts';
import StatusMap from '../../../src/task/task-status.ts';

suite('Task Constructor', () => {
	const taskProps = {
		id: 1,
		description: 'call to mr. John Doe',
		status: StatusMap.todo,
		timeStamp: Date.now()
	} as const;

	const task = new Task(taskProps.id, taskProps.description, taskProps.status, taskProps.timeStamp);

	test('new Task instance should be created', () => {
		ok(task instanceof Task);
	});

	test('should correctly assign all values', () => {
		strictEqual(task.id, taskProps.id);
		strictEqual(task.description, taskProps.description);
		strictEqual(task.status, taskProps.status);
		strictEqual(task.createdAt, taskProps.timeStamp);
		strictEqual(task.updatedAt, taskProps.timeStamp);
	});
});
