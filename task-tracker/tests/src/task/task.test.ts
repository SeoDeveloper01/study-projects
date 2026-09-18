import { ok, strictEqual } from 'node:assert/strict';
import { suite, test } from 'node:test';

import StatusMap from '../../../src/task/task-status.ts';
import CreateTaskDTO from '../../../src/task/task.ts';

suite('Create Task DTO', () => {
	const taskProps = {
		description: 'call to mr. John Doe',
		status: StatusMap.todo,
		timeStamp: Date.now()
	} as const;

	const task = new CreateTaskDTO(taskProps.description, taskProps.status, taskProps.timeStamp);

	test('new Task instance should be created', () => {
		ok(task instanceof CreateTaskDTO);
	});

	test('should correctly assign all values', () => {
		strictEqual(task.description, taskProps.description);
		strictEqual(task.status, taskProps.status);
		strictEqual(task.createdAt, taskProps.timeStamp);
		strictEqual(task.updatedAt, taskProps.timeStamp);
	});
});
