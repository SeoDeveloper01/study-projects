import type Command from './command.ts';
import { commands, isCommandKey, parseInput } from './utils.ts';

export default class CommandRouter {
	private readonly commands: Command;

	public constructor(commands: Command) {
		this.commands = commands;
	}

	public async exec(input: string) {
		const parts = await parseInput(input);
		const command = parts[0];

		if (command && isCommandKey(command)) this.commands[command](parts);
		else throw `List of available commands - ${commands.join(', ')}`;
	}
}
