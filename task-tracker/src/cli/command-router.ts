import type Command from './command.ts';
import { commandList, commandSchema, isCommandKey, parseInput } from './utils.ts';

export default class CommandRouter {
	private readonly commands: Command;

	public constructor(commands: Command) {
		this.commands = commands;
	}

	public exec(input: string): void {
		const parts = parseInput(input);
		const command = parts[commandSchema.command];

		if (command && isCommandKey(command)) this.commands[command](parts);
		else throw new Error(`List of available commands - ${commandList.join(', ')}`);
	}
}
