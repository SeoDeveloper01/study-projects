import { createInterface } from 'node:readline/promises';
import { isNativeError } from 'node:util/types';
import { autocomplete, welcomeMessage } from './src/cli/utils.ts';
import TaskStorageManager from './src/storage/task-storage-manager.ts';
import TaskStorage from './src/storage/task-storage.ts';
import TaskManager from './src/task/task-manager.ts';
import Task from './src/task/task.ts';
import CommandRouter from './src/cli/command-router.ts';
import Command from './src/cli/command.ts';

const PATH_TO_STORAGE = 'storage.json';

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
		console.error('[WARNING] ' + (isNativeError(error) ? error.message : 'Unexpected error'));
	} finally {
		if (isReadlineInterfaceOpen) readlineInterface.prompt();
	}
});

readlineInterface.on('close', () => {
	isReadlineInterfaceOpen = false;
	storageManager.saveStorage();
	console.log('[INFO] Goodbye, have a productive day!');
});

console.log(welcomeMessage);

readlineInterface.prompt();
