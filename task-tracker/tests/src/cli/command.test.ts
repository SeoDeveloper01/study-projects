import type { Interface } from 'node:readline/promises';
import { deepStrictEqual, throws, strictEqual } from 'node:assert/strict';
import { afterEach, before, mock, suite, test } from 'node:test';
import { format } from 'node:util';

import type TaskManager from '../../../src/task/task-manager.ts';
import Command from '../../../src/cli/command.ts';
import message, { userManual } from '../../../src/cli/messages.ts';
import StatusMap, { statusList } from '../../../src/task/task-status.ts';

suite('CLI Command', () => {
	const readlineInterfaceMock = {
		close: mock.fn()
	} satisfies Partial<Interface>;

	const taskManagerMock = {
		add: mock.fn(),
		update: mock.fn(),
		delete: mock.fn(),
		getTaskList: mock.fn()
	} satisfies Partial<TaskManager>;

	const consoleLogMock = mock.method(console, 'log', () => undefined).mock;
	const command = new Command(readlineInterfaceMock as unknown as Interface, taskManagerMock as unknown as TaskManager);

	suite('add method', () => {
		const taskManagerAddMock = taskManagerMock.add.mock;

		taskManagerAddMock.mockImplementation((description) => {
			const timeStamp = Date.now();

			return { id: 1, description, status: 0, createdAt: timeStamp, updatedAt: timeStamp };
		});

		afterEach(() => taskManagerAddMock.resetCalls());

		test('should throw for invalid task description', () => {
			throws(() => command.add(['add']), new Error(message.taskDescriptionEmpty), 'description empty');
			throws(
				() =>
					command.add([
						'add',
						'Loremipsumdolora',
						'sitametconsectetu',
						'adipiscingelita',
						'vulputateplacera',
						'integervitaeurna',
						'facilisisgravida',
						'vehiculaseuismod',
						'curabiturp'
					]),
				new Error(message.taskDescriptionLong),
				'description too long'
			);
		});

		test('should call taskManager.add method with correct description', () => {
			strictEqual(taskManagerAddMock.callCount(), 0);
			strictEqual(command.add(['add', 'call', 'to', 'mr.', 'John', 'Doe']), undefined);
			strictEqual(taskManagerAddMock.callCount(), 1);
			deepStrictEqual(taskManagerAddMock.calls[0]?.arguments, ['call to mr. John Doe']);
		});
	});

	suite('delete method', () => {
		const taskManagerDeleteMock = taskManagerMock.delete.mock;

		taskManagerDeleteMock.mockImplementation(() => true);
		afterEach(() => taskManagerDeleteMock.resetCalls());

		test('should throw for invalid task ID', () => {
			const expectedError = new Error(message.taskIdInvalid);

			throws(() => command.delete(['delete']), expectedError, 'task ID empty');
			throws(() => command.delete(['delete', 'one']), expectedError, 'task ID not a number');
		});

		test('should throw for unknown task ID', () => {
			taskManagerDeleteMock.mockImplementationOnce(() => false);
			throws(() => command.delete(['delete', '42']), new Error(format(message.taskIdUnknown, 42)));
		});

		test('should call taskManager.delete method with correct task ID', () => {
			strictEqual(taskManagerDeleteMock.callCount(), 0);
			strictEqual(command.delete(['delete', '1']), undefined);
			strictEqual(taskManagerDeleteMock.callCount(), 1);
			deepStrictEqual(taskManagerDeleteMock.calls[0]?.arguments, [1]);
		});
	});

	suite('exit method', () => {
		const readlineInterfaceCloseMock = readlineInterfaceMock.close.mock;

		test('should call readlineInterface.close method', () => {
			strictEqual(readlineInterfaceCloseMock.callCount(), 0);
			strictEqual(command.exit(), undefined);
			strictEqual(readlineInterfaceCloseMock.callCount(), 1);
		});
	});

	suite('help method', () => {
		before(() => consoleLogMock.resetCalls());

		test('should call console.log method with user manual', () => {
			strictEqual(consoleLogMock.callCount(), 0);
			strictEqual(command.help(), undefined);
			strictEqual(consoleLogMock.callCount(), 1);
			deepStrictEqual(consoleLogMock.calls[0]?.arguments, [userManual]);
		});
	});

	suite('list method', () => {
		const taskManagerGetTaskListMock = taskManagerMock.getTaskList.mock;

		taskManagerGetTaskListMock.mockImplementation(() => ({}));
		afterEach(() => taskManagerGetTaskListMock.resetCalls());

		test('should throw for invalid task status', () => {
			throws(() => command.list(['list', 'unknown-status']), new Error(message.availableStatuses));
		});

		test('should call taskManager.getTaskList method with correct task status code', async (testContext) => {
			const testCases = new Array<Promise<void>>();

			for (const status of statusList) {
				testCases.push(
					testContext.test(status, { concurrency: true }, () => {
						strictEqual(taskManagerGetTaskListMock.callCount(), 0);
						strictEqual(command.list(['list', status]), undefined);
						strictEqual(taskManagerGetTaskListMock.callCount(), 1);
						deepStrictEqual(taskManagerGetTaskListMock.calls[0]?.arguments, [StatusMap[status]]);
					})
				);
			}

			await Promise.allSettled(testCases);
		});

		test('should call taskManager.getTaskLIst method with empty task status code', () => {
			strictEqual(taskManagerGetTaskListMock.callCount(), 0);
			strictEqual(command.list(['list']), undefined);
			strictEqual(taskManagerGetTaskListMock.callCount(), 1);
			deepStrictEqual(taskManagerGetTaskListMock.calls[0]?.arguments, [undefined]);
		});
	});

	suite('mark method', () => {
		const taskManagerUpdateMock = taskManagerMock.update.mock;

		taskManagerUpdateMock.mockImplementation(() => true);
		afterEach(() => taskManagerUpdateMock.resetCalls());

		test('should throw for invalid task ID', () => {
			const expectedError = new Error(message.taskIdInvalid);

			throws(() => command.mark(['mark']), expectedError, 'task ID empty');
			throws(() => command.mark(['mark', 'one']), expectedError, 'task ID not a number');
		});

		test('should throw for unknown task ID', () => {
			taskManagerUpdateMock.mockImplementationOnce(() => false);
			throws(() => command.mark(['mark', '42', 'in-progress']), new Error(format(message.taskIdUnknown, 42)));
		});

		test('should throw for invalid task status', () => {
			throws(() => command.mark(['mark', '1', 'unknown-status']), new Error(message.availableStatuses));
		});

		test('should call taskManager.update method with correct task ID and status code', async (testContext) => {
			const testCases = new Array<Promise<void>>();

			for (let index = 0; index < statusList.length; index++) {
				const status = statusList[index];

				if (status) {
					testCases.push(
						testContext.test(status, { concurrency: true }, () => {
							strictEqual(taskManagerUpdateMock.callCount(), 0);
							strictEqual(command.mark(['mark', index.toString(), status]), undefined);
							strictEqual(taskManagerUpdateMock.callCount(), 1);
							deepStrictEqual(taskManagerUpdateMock.calls[0]?.arguments, [index, StatusMap[status]]);
						})
					);
				}
			}

			await Promise.allSettled(testCases);
		});
	});

	suite('update method', () => {
		const taskManagerUpdateMock = taskManagerMock.update.mock;

		taskManagerUpdateMock.mockImplementation(() => true);
		afterEach(() => taskManagerUpdateMock.resetCalls());

		test('should throw for invalid task ID', () => {
			const expectedError = new Error(message.taskIdInvalid);

			throws(() => command.update(['update']), expectedError, 'task ID empty');
			throws(() => command.update(['update', 'one']), expectedError, 'task ID not a number');
		});

		test('should throw for unknown task ID', () => {
			taskManagerUpdateMock.mockImplementationOnce(() => false);
			throws(
				() => command.update(['update', '42', 'call', 'to', 'mr.', 'John', 'Doe']),
				new Error(format(message.taskIdUnknown, 42))
			);
		});

		test('should throw for invalid task description', () => {
			throws(() => command.update(['update', '1']), new Error(message.taskDescriptionEmpty), 'description empty');
			throws(
				() =>
					command.update([
						'update',
						'1',
						'Loremipsumdolora',
						'sitametconsectetu',
						'adipiscingelita',
						'vulputateplacera',
						'integervitaeurna',
						'facilisisgravida',
						'vehiculaseuismod',
						'curabiturp'
					]),
				new Error(message.taskDescriptionLong),
				'description too long'
			);
		});

		test('should call taskManager.update method with correct task ID and description', () => {
			strictEqual(taskManagerUpdateMock.callCount(), 0);
			strictEqual(command.update(['update', '1', 'call', 'to', 'mr.', 'John', 'Doe']), undefined);
			strictEqual(taskManagerUpdateMock.callCount(), 1);
			deepStrictEqual(taskManagerUpdateMock.calls[0]?.arguments, [1, 'call to mr. John Doe']);
		});
	});
});
