import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskListComponent, TaskCreateComponent } from './controller/task/task';
import { LoginComponent, SignupComponent } from './controller/auth/auth';
import { AuthGuard } from './controller/helper/auth.guard';

const routes: Routes = [
  {path: '', component: TaskListComponent },
  {path: 'task/create', component: TaskCreateComponent, canActivate: [AuthGuard] },
  {path: 'task/edit/:taskId', component: TaskCreateComponent, canActivate: [AuthGuard] },
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
