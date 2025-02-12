// src/app/Todo.ts
export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  userId?: string; // Added to match API
}

export interface TodoResponse extends Omit<Todo, 'id'> {
  _id: string; // MongoDB ID
}
