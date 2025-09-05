import type { Completer } from 'node:readline/promises';
import type { CommandKey } from './command.ts';

export const commandList = new Array<CommandKey>('add', 'delete', 'exit', 'help', 'list', 'mark', 'update');

export const commandSchema = {
	command: 0,
	taskID: 1,
	statusList: 1,
	statusMark: 2,
	descriptionAdd: 1,
	descriptionUpd: 2
} as const;

export const isCommandKey = (input: string): input is CommandKey => (commandList as string[]).includes(input);

export const autocomplete: Completer = (input: string) => {
	const match = new Array<string>();

	for (const command of commandList) {
		if (command.startsWith(input)) match.push(command);
	}

	return [match, input];
};

export const parseInput = (input: string): string[] => {
	const parts = new Array<string>(),
		inputLength = input.length;

	for (let index = 0, start: number; index < inputLength; index++) {
		if (input[index] !== ' ') {
			start = index;
			while (++index < inputLength && input[index] !== ' ');
			parts.push(input.slice(start, index));
		}
	}

	return parts;
};
