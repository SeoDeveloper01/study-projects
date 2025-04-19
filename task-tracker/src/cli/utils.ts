import type { Completer } from 'node:readline/promises';
import type { CommandKey } from './command.ts';

export const commands = new Array<CommandKey>('add', 'delete', 'exit', 'help', 'list', 'mark', 'update');

export const isCommandKey = (input: string): input is CommandKey => commands.includes(input as CommandKey);

export const autocomplete: Completer = async (input: string) => {
	const match = new Array<string>();

	for (let index = 0; index < commands.length; index++) {
		if (commands[index]!.startsWith(input)) match.push(commands[index]!);
	}

	return [match.length ? match : commands, input];
};

export const parseInput = async (input: string): Promise<string[]> => {
	const parts = new Array<string>(),
		inputLength = input.length;

	for (let index = 0, start = 0; index < inputLength; index++) {
		if (input[index] !== ' ') {
			start = index;
			while (++index < inputLength && input[index] !== ' ');
			parts.push(input.slice(start, index));
		}
	}

	return parts;
};

export const userManual = `
┌───────────────────────────┬──────────────────────────────────────────────┐
│ Command                   │ Description                                  │
├───────────────────────────┼──────────────────────────────────────────────┤
│ add {description}         │ Create a new task with the given description │
│ update {ID} {description} │ Update the task with the specified ID        │
│ mark {ID} {status}        │ Change status (todo, in-progress, done)      │
│ delete {ID}               │ Delete the task with the specified ID        │
│ list                      │ Display all tasks                            │
│ list {status}             │ Display tasks with the given status          │
│ exit / Ctrl+C             │ Close the CLI application                    │
└───────────────────────────┴──────────────────────────────────────────────┘
`;
