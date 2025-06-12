const StatusMap = {
	'todo': 0,
	'in-progress': 1,
	'done': 2
} as const;

export default StatusMap;

export type StatusKey = keyof typeof StatusMap;

export type StatusCode = (typeof StatusMap)[StatusKey];

export const statusList = new Array<StatusKey>('done', 'in-progress', 'todo');

export const isStatusKey = (input: string): input is StatusKey => Object.hasOwn(StatusMap, input);

export const reverseStatusMap = Object.fromEntries(
	Object.entries(StatusMap).map(([key, value]) => [value as StatusCode, key as StatusKey])
);
