// Defines a TypeScript interface `Todo`.
// Specifies the structure of a todo item.
// Properties:
// - `id`: number, unique identifier.
// - `title`: string, brief summary.
// - `description`: string, detailed explanation.
// - `completed`: boolean, task completion status.

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}
