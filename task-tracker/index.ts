import { createInterface } from 'node:readline/promises';
import { DatabaseSync } from 'node:sqlite';

import CommandRouter from './src/cli/command-router.ts';
import Command from './src/cli/command.ts';
import message, { prefix, welcome } from './src/cli/messages.ts';
import { autocomplete } from './src/cli/utils.ts';

import TaskStorage from './src/storage/task-storage.ts';

import TaskManager from './src/task/task-manager.ts';
import CreateTaskDTO from './src/task/task.ts';

const PATH_TO_STORAGE = process.env.PATH_TO_STORAGE ?? 'storage.db';

const readlineInterface = createInterface({
	input: process.stdin,
	output: process.stdout,
	completer: autocomplete
});

const sqlite = new DatabaseSync(PATH_TO_STORAGE),
	storage = new TaskStorage(sqlite),
	taskManager = new TaskManager(storage, CreateTaskDTO),
	command = new Command(readlineInterface, taskManager),
	commandRouter = new CommandRouter(command);

let isReadlineInterfaceOpen = true;

readlineInterface.on('line', (input) => {
	try {
		commandRouter.exec(input);
	} catch (error) {
		console.error(`${prefix.warning} ${Error.isError(error) ? error.message : message.unexpectedError}`);
	} finally {
		if (isReadlineInterfaceOpen) readlineInterface.prompt();
	}
});

readlineInterface.on('close', () => {
	isReadlineInterfaceOpen = false;
	sqlite.close();
	console.log(`${prefix.info} ${message.goodbye}`);
});

console.log(welcome);

readlineInterface.prompt();
