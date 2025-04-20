import { createInterface } from 'node:readline/promises';
import { autocomplete, welcomeMessage } from './src/cli/utils.ts';
import StorageManager from './src/storage/storage-manager.ts';
import Storage from './src/storage/storage.ts';
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

const storage = new Storage(PATH_TO_STORAGE),
	storageManager = new StorageManager(storage),
	taskManager = new TaskManager(storageManager.getStorage(), Task),
	command = new Command(readlineInterface, taskManager),
	commandRouter = new CommandRouter(command);

readlineInterface.on('line', async (input) => {
	try {
		await commandRouter.exec(input);
	} catch (error) {
		console.error('[WARNING] ' + error);
	}
});

readlineInterface.on('close', async () => {
	await storageManager.saveStorage();
	console.log('[INFO] Goodbye, have a productive day!');
});

console.log(welcomeMessage);
