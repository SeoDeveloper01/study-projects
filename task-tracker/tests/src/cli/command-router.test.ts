import { throws, strictEqual, deepStrictEqual, type AssertPredicate } from 'node:assert/strict';
import { mock, suite, test } from 'node:test';
import { isNativeError } from 'node:util/types';

import CommandRouter from '../../../src/cli/command-router.ts';
import type Command from '../../../src/cli/command.ts';
import { commandList } from '../../../src/cli/utils.ts';

suite('CLI Command Router', () => {
	const commandMock = {
		add: mock.fn(),
		help: mock.fn(),
		list: mock.fn(),
		mark: mock.fn(),
		exit: mock.fn(),
		update: mock.fn(),
		delete: mock.fn()
	} satisfies Partial<Command>;

	const commandRouter = new CommandRouter(commandMock as unknown as Command);

	test('should call corresponding method for valid command', async (testContext) => {
		const testCases = new Array<Promise<void>>();

		for (const command of commandList) {
			testCases.push(
				testContext.test(command, { concurrency: true }, () => {
					const commandMethodMock = commandMock[command].mock;

					strictEqual(commandMethodMock.callCount(), 0);
					strictEqual(commandRouter.exec(command), undefined);
					strictEqual(commandMethodMock.callCount(), 1);
					deepStrictEqual(commandMethodMock.calls[0]?.arguments, [[command]]);

					commandMethodMock.resetCalls();
				})
			);
		}

		await Promise.allSettled(testCases);
	});

	test('should throw error for unknown command', () => {
		const isErrorMessageValid: AssertPredicate = (thrown) => {
			if (!isNativeError(thrown)) return false;

			for (const command of commandList) {
				if (!thrown.message.includes(command)) return false;
			}

			return true;
		};

		throws(() => commandRouter.exec(''), isErrorMessageValid, 'command empty');
		throws(() => commandRouter.exec('unknown-command'), isErrorMessageValid, 'command invalid');
	});
});
