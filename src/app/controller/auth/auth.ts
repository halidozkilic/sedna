import {Component} from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/service/authService';

@Component({
  templateUrl: '../../template/auth/login.html',
  styleUrls: ['../../design/global.css']
})
export class LoginComponent {

  constructor(public authService: AuthService) {}

  onLogin(form: NgForm) {
    if(form.invalid) {
      return;
    }
   
    this.authService.login(form.value.email, form.value.password);
  }
}


@Component({
  templateUrl: '../../template/auth/signup.html',
  styleUrls: ['../../design/global.css']
})
export class SignupComponent {

  constructor(public authService: AuthService) {}

  onSignup(form: NgForm) {
    if(form.invalid) {
      return;
    }
    console.log(form.value.email);
    this.authService.createUser(form.value.email, form.value.password);
  }
}
