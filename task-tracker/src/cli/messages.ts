import { statusList } from '../task/task-status.ts';
import { commandList } from './utils.ts';

export default {
	goodbye: 'Goodbye, have a productive day!',
	unexpectedError: 'Unexpected error',
	storageCorrupted: 'TaskStorage was corrupted. A new TaskStorage will be created.',
	availableCommands: `List of available commands - ${commandList.join(', ')}`,
	availableStatuses: `List of available statuses - ${statusList.join(', ')}`,
	taskDescriptionEmpty: "Description can't be empty!",
	taskDescriptionLong: 'Description too long!',
	taskAdded: 'Task (ID: %d) added',
	taskIdInvalid: 'Task ID must be a valid number!',
	taskIdUnknown: "Task (ID: %d) doesn't exist!",
	taskDeleted: 'Task (ID: %d) deleted',
	taskListEmpty: 'The task list is empty',
	taskStatusChanged: 'Task (ID: %d) status changed',
	taskDescriptionUpdated: 'Task (ID: %d) description updated'
} as const;

export const prefix = {
	info: '[INFO]',
	success: '[SUCCESS]',
	warning: '[WARNING]'
} as const;

export const welcome = `
┌──────────────────────────────────────────────────────────────────────────┐
│                       Welcome to Task Tracker CLI                        │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                       Manage your tasks with ease                        │
│                 Type \`help\` to see available commands                    │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
`;

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
