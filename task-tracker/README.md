# Task Tracker

A command-line application for managing tasks and tracking to-do list.

## How to Use:

-   `npm run start` - launch the Task Tracker CLI;
-   `add {description}` - create a new task with the given description;
-   `update {ID} {description}` - update an existing task by its ID;
-   `mark {ID} {status}` - change status (`todo`, `in-progress`, `done`);
-   `delete {ID}` - delete a task by its ID;
-   `list` - show all tasks;
-   `list {status}` - show tasks with the given status;
-   `exit` or `Ctrl+C` - quit the application.

## Performance Optimizations:

-   Efficient DSA like Hash Tables are used, so most operations have O(1) time and space complexity;
-   A custom parser handles user input, efficiently splitting the input string into commands and trimming spaces between them;
-   Read/write operations to the `storage.json` are expensive, so they're performed only at the start/end of the application's lifecycle, while the TaskStorage object is kept in RAM during runtime;
-   String comparison (like status matching) is slow and character-by-character, so wherever possible, strings are replaced with integers for faster equality checks.

##

_You can find [other projects here](/README.md) • For more information https://roadmap.sh/projects/task-tracker_
