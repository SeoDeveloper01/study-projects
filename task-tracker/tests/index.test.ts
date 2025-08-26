import { ok } from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { unlink } from 'node:fs/promises';
import { EOL } from 'node:os';
import { after, suite, test } from 'node:test';

import message, { userManual, welcome } from '../src/cli/messages.ts';

suite('Task Tracker Entry Point', () => {
	const PATH_TO_STORAGE = './tests/e2e-storage.json';

	const taskTrackerApp = spawn('node', ['--no-warnings', 'index.ts'], {
		stdio: ['pipe', 'pipe', 'ignore'],
		env: { PATH_TO_STORAGE },
		windowsHide: true,
		shell: true
	});

	const executeCommand = async (cliApp: typeof taskTrackerApp, command: string): Promise<string> => {
		return new Promise<string>((resolve, reject) => {
			const callback = (data: Buffer): void => {
				const output = data.toString().trim();

				if (output !== '>') {
					cliApp.stdout.removeListener('data', callback);
					resolve(output);
				}
			};

			cliApp.stdout.on('data', callback);

			cliApp.stdin.write(command + EOL, (error) => {
				if (error) reject(error);
			});
		});
	};

	after(() => {
		taskTrackerApp.kill();
		unlink(PATH_TO_STORAGE);
	});

	test('should show welcome message on start', async () => {
		const outputMessage = await new Promise<string>((resolve) => {
			taskTrackerApp.stdout.once('data', (data: Buffer) => {
				resolve(data.toString());
			});
		});

		ok(outputMessage.includes(welcome.trim()));
	});

	test('should show user manual', async () => {
		ok((await executeCommand(taskTrackerApp, 'help')).includes(userManual.trim()));
	});

	test('should show goodbye message on end', async () => {
		ok((await executeCommand(taskTrackerApp, 'exit')).includes(message.goodbye));
	});
});
