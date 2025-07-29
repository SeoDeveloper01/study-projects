import { deepStrictEqual, ok } from 'node:assert/strict';
import { test, suite } from 'node:test';

import StatusMap, { isStatusKey, statusList } from '../../../src/task/task-status.ts';

suite('Task Status', () => {
	suite('statusList array', () => {
		test('should contain all status keys', () => {
			deepStrictEqual(statusList, Object.keys(StatusMap));
		});
	});

	suite('isStatusKey type guard', () => {
		test('should return true for valid status keys', async (testContext) => {
			const testCases = new Array<Promise<void>>();

			for (const status of Object.keys(StatusMap)) {
				testCases.push(
					testContext.test(status, () => {
						ok(isStatusKey(status));
					})
				);
			}

			await Promise.allSettled(testCases);
		});

		test('should return false for unknown status keys', () => {
			ok(!isStatusKey(''));
			ok(!isStatusKey('unknown-status'));
		});
	});
});
