import { createInterface } from 'node:readline/promises';
import { isNativeError } from 'node:util/types';

import Command from './src/cli/command.ts';
import CommandRouter from './src/cli/command-router.ts';
import message, { prefix, welcome } from './src/cli/messages.ts';
import { autocomplete } from './src/cli/utils.ts';

import TaskStorage from './src/storage/task-storage.ts';
import TaskStorageManager from './src/storage/task-storage-manager.ts';

import Task from './src/task/task.ts';
import TaskManager from './src/task/task-manager.ts';

const PATH_TO_STORAGE = process.env.PATH_TO_STORAGE ?? 'storage.json';

const readlineInterface = createInterface({
	input: process.stdin,
	output: process.stdout,
	completer: autocomplete
});

const storage = new TaskStorage(PATH_TO_STORAGE),
	storageManager = new TaskStorageManager(storage),
	taskManager = new TaskManager(storageManager.getStorage(), Task),
	command = new Command(readlineInterface, taskManager),
	commandRouter = new CommandRouter(command);

let isReadlineInterfaceOpen = true;

readlineInterface.on('line', (input) => {
	try {
		commandRouter.exec(input);
	} catch (error) {
		console.error(`${prefix.warning} ${isNativeError(error) ? error.message : message.unexpectedError}`);
	} finally {
		if (isReadlineInterfaceOpen) readlineInterface.prompt();
	}
});

readlineInterface.on('close', () => {
	isReadlineInterfaceOpen = false;
	storageManager.saveStorage();
	console.log(`${prefix.info} ${message.goodbye}`);
});

console.log(welcome);

readlineInterface.prompt();
