import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { UserDTO } from '../model/user/userDTO';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root'})
export class AuthService {

  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: UserDTO = { email: email, password: password};
    console.log("deneme"+authData.email);
    this.http.post('api/auth/signup', authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData: UserDTO = { email: email, password: password };
    this.http.post<{token: string, expiresIn: number}>('api/auth/login', authData)
    .subscribe(response => {
      this.token = response.token;
      if (this.token) {
        const expiresDuration = response.expiresIn;
        this.setAuthTimer(expiresDuration);
        this.tokenTimer = setTimeout(() => {
          this.logout();
        }, expiresDuration * 1000);
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresDuration * 1000);
        this.saveAuthLocale(this.token, expirationDate);
        this.router.navigate(['/']);
      }
    });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = null;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthLocale();
    this.router.navigate(['/']);
  }

  autoAuthUser() {
    const authInformation = this.getAuthLocale();
    if(!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthLocale(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthLocale() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthLocale() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if(!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }

}
