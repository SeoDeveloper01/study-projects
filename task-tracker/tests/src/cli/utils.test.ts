import { deepStrictEqual, strictEqual } from 'node:assert/strict';
import { suite, test } from 'node:test';

import { autocomplete, commandList, parseInput } from '../../../src/cli/utils.ts';

suite('CLI Utils', () => {
	suite('Command autocompletion in Terminal', () => {
		test('autocomplete for empty input', () => {
			deepStrictEqual(autocomplete(''), [commandList, '']);
			deepStrictEqual(autocomplete(' '), [[], ' ']);
			deepStrictEqual(autocomplete(' 	 '), [[], ' 	 ']);
		});

		test('autocomplete for unknown command', () => {
			deepStrictEqual(autocomplete('unknown-command'), [[], 'unknown-command']);
		});

		test('should find at least 1 command', async (testContext) => {
			const testCases = new Array<Promise<void>>();

			for (const command of commandList) {
				testCases.push(
					testContext.test(command, { concurrency: true }, async () => {
						strictEqual((await autocomplete(command[0] ?? ''))[0].length > 0, true);
					})
				);
			}

			await Promise.allSettled(testCases);
		});
	});

	suite('Parse input string from Terminal', () => {
		test('perfect input string', () => {
			deepStrictEqual(parseInput('help'), ['help']);
			deepStrictEqual(parseInput('mark 1 done'), ['mark', '1', 'done']);
			deepStrictEqual(parseInput('add call to mr. John Doe'), ['add', 'call', 'to', 'mr.', 'John', 'Doe']);
		});

		test('empty input string', () => {
			deepStrictEqual(parseInput(''), []);
			deepStrictEqual(parseInput(' '), []);
			deepStrictEqual(parseInput('  '), []);
		});

		test('string with random placed spacebars', () => {
			deepStrictEqual(parseInput('delete     14 '), ['delete', '14']);
			deepStrictEqual(parseInput(" add   wake up  at 10 o'clock  "), ['add', 'wake', 'up', 'at', '10', "o'clock"]);
		});

		test('input string with non-latin chars', () => {
			deepStrictEqual(parseInput('<!--🫡-->'), ['<!--🫡-->']);
			deepStrictEqual(parseInput('строка на русском языке'), ['строка', 'на', 'русском', 'языке']);
		});
	});
});
