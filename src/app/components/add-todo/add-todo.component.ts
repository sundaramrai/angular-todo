import { Component, EventEmitter, Output } from '@angular/core';
import { Todo } from '../../Todo';

@Component({
  selector: 'app-add-todo',
  standalone: false,
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css'], // why [] is used?
  // [] is used to include the CSS file because it is an array of strings. If you have multiple CSS files, you can include them all in the array.
})
export class AddTodoComponent {
  @Output() todoAdd = new EventEmitter<Todo>();

  todoTitle: string = '';
  todoDescription: string = '';

  onSubmit() {
    if (this.todoTitle.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        title: this.todoTitle,
        description: this.todoDescription,
        completed: false,
      };
      // console.log('Creating new todo:', {
      //   title: this.todoTitle,
      //   description: this.todoDescription,
      //   timestamp: new Date().toLocaleString(),
      // });

      this.todoAdd.emit(newTodo);
      this.todoTitle = '';
      this.todoDescription = '';
    } else {
      alert('Todo title is required to add a new todo.');
    }
  }
}
