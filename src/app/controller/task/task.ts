import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';

import { TaskDTO } from '../../model/task/taskDTO';
import { TaskService } from 'src/app/service/taskService';
import { AuthService } from 'src/app/service/authService';

@Component({
  selector: 'app-task-create',
  templateUrl: '../../template/task/task-create.html',
  styleUrls: ['../../design/global.css'],
})
export class TaskCreateComponent implements OnInit {

  enteredTitle = '';
  enteredDescription = '';
  task: TaskDTO;
  private mode = 'create';
  private taskId: string;

  constructor(public taskService: TaskService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('taskId')) {
        this.mode = 'edit';
        this.taskId = paramMap.get('taskId');
        this.task = this.taskService.getTask(this.taskId);
      } else {
        this.mode = 'create';
        this.taskId = null;
      }
    });
  }

  saveTask(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.taskService.createTask(form.value.title, form.value.description);
    } else {
      this.taskService.updateTask(this.taskId, form.value.title, form.value.description);
    }

    form.resetForm();
  }
}

@Component({
  selector: 'app-task-list',
  templateUrl: '../../template/task/task-list.html',
  styleUrls: ['../../design/task/task.css']
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: TaskDTO[] = [];
  userIsAuthenticated = false;
  private taskSubscription: Subscription;
  private authSubscription: Subscription;

  constructor(public taskService: TaskService, private authService: AuthService) {}

  ngOnInit() {
    this.taskService.getTaskList();
    this.taskSubscription = this.taskService.getTaskUpdateListener()
      .subscribe((tasks: TaskDTO[]) => {
        this.tasks = tasks;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authSubscription = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  onDelete(taskId: string) {
    this.taskService.deleteTask(taskId);
  }

  ngOnDestroy() {
    this.taskSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }
}
