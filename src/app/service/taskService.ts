import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { TaskDTO } from '../model/task/taskDTO';


@Injectable({providedIn: 'root'})
export class TaskService {
  private tasks: TaskDTO[] = [];
  private taskUpdated = new Subject<TaskDTO[]>();

  constructor(private http: HttpClient) {}

  getTaskList() {
    this.http.get<{message: string, status: number, tasks: any}>('api/task/tasks')
    .pipe(map((data) => {
      return data.tasks.map(task => {
        return {
          id: task._id,
          title: task.title,
          description: task.description
        };
      });
    }))
    .subscribe((transformedTasks) => {
      this.tasks = transformedTasks;
      this.taskUpdated.next([...this.tasks]);
    });
  }

  getTaskUpdateListener() {
    return this.taskUpdated.asObservable();
  }

  getTask(id: string) {
    return {...this.tasks.find(x => x.id === id)};
  }

  createTask(mTitle: string, mDescription: string) {
    const task: TaskDTO = {id: null, title: mTitle, description: mDescription };
    this.http.post<{message: string, status: number, taskId: string}>('api/task/createTask', task)
    .subscribe((data) => {
      const id = data.taskId;
      task.id = id;
      this.tasks.push(task);
      this.taskUpdated.next([...this.tasks]);
    });
  }

  updateTask(mId: string, mTitle: string, mDescription: string) {
    const task: TaskDTO = { id: mId, title: mTitle, description: mDescription};
    this.http.put('api/task/editTask/' + mId, task)
    .subscribe(response => console.log(response));
  }

  deleteTask(taskId: string) {
    this.http.delete('api/task/tasks/' + taskId)
    .subscribe(() => {
      const updatedTasks = this.tasks.filter(task => task.id !== taskId);
      this.tasks = updatedTasks;
      this.taskUpdated.next([...this.tasks]);
    });
  }
}
