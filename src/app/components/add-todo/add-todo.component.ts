// src/app/components/add-todo/add-todo.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { Todo } from '../../Todo';

@Component({
  selector: 'app-add-todo',
  standalone: false,
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css'],
})
export class AddTodoComponent {
  @Output() todoAdd = new EventEmitter<Omit<Todo, 'id'>>(); // ✅ Emit without `id`

  todoTitle: string = '';
  todoDescription: string = '';

  onSubmit() {
    if (!this.todoTitle.trim()) {
      alert('Todo title is required to add a new todo.');
      return;
    }

    const newTodo = {
      title: this.todoTitle,
      description: this.todoDescription,
      completed: false,
    };

    this.todoAdd.emit(newTodo); // ✅ No `id`, let backend generate `_id`
    this.todoTitle = '';
    this.todoDescription = '';
  }
}
