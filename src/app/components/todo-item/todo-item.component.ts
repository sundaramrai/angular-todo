// src/app/components/todo-item/todo-item.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../../Todo';

@Component({
  selector: 'app-todo-item',
  standalone: false,
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() todoDelete = new EventEmitter<Todo>();
  @Output() todoUpdate = new EventEmitter<Todo>();
  @Output() todoToggle = new EventEmitter<Todo>();

  isEditing: boolean = false;
  editTitle: string = '';
  editDescription: string = '';

  onDelete() {
    console.log('Initiating delete for todo:', {
      title: this.todo.title,
      id: this.todo.id,
      timestamp: new Date().toLocaleString(),
    });
    this.todoDelete.emit(this.todo);
  }

  onToggleComplete() {
    console.log('Initiating toggle completion for todo:', {
      title: this.todo.title,
      id: this.todo.id,
      currentStatus: this.todo.completed,
      timestamp: new Date().toLocaleString(),
    });
    this.todoToggle.emit(this.todo);
  }

  startEdit() {
    this.isEditing = true;
    this.editTitle = this.todo.title;
    this.editDescription = this.todo.description;
    console.log('Started editing todo:', {
      id: this.todo.id,
      title: this.todo.title,
      timestamp: new Date().toLocaleString(),
    });
  }

  saveEdit() {
    if (this.editTitle.trim() && this.editDescription.trim()) {
      const updatedTodo: Todo = {
        ...this.todo,
        title: this.editTitle,
        description: this.editDescription,
      };

      console.log('Saving edited todo:', {
        id: this.todo.id,
        oldTitle: this.todo.title,
        newTitle: this.editTitle,
        oldDescription: this.todo.description,
        newDescription: this.editDescription,
        timestamp: new Date().toLocaleString(),
      });

      this.todoUpdate.emit(updatedTodo);
      this.isEditing = false;
    }
  }

  cancelEdit() {
    console.log('Cancelled editing todo:', {
      id: this.todo.id,
      title: this.todo.title,
      timestamp: new Date().toLocaleString(),
    });
    this.isEditing = false;
  }
}
