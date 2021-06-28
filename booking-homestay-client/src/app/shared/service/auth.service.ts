import {HttpClient} from '@angular/common/http';
import {EventEmitter, Injectable, Output} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {LoginRequest} from '../model/login/login-request';
import {LoginResponse} from '../model/login/login-response';
import {map, tap} from 'rxjs/operators';
import {RegisterRequest} from '../model/register/register-request';
import {LocalStorageService} from 'ngx-webstorage';
import {ForgotPasswordRequest} from '../model/forgot-password/forgot-password-request';
import {ResetPasswordRequest} from '../model/reset-password/reset-password.-request';


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  @Output() image: EventEmitter<string> = new EventEmitter();
  @Output() username: EventEmitter<string> = new EventEmitter();
  @Output() role: EventEmitter<string> = new EventEmitter();


  constructor(private http: HttpClient, private localStorage: LocalStorageService) {
  }

  login(loginRequest: LoginRequest): Observable<boolean> {
    return this.http.post<LoginResponse>('/api/auth/login',
      loginRequest).pipe(map(data => {
      this.localStorage.store('authenticationToken', data.authenticationToken);
      this.localStorage.store('userName', data.userName);
      this.localStorage.store('refreshToken', data.refreshToken);
      this.localStorage.store('expiresAt', data.expiresAt);
      this.localStorage.store('role', data.role);
      this.localStorage.store('image', data.image);
      this.username.emit(data.userName);
      this.role.emit(data.role);
      this.image.emit(data.image);
      return true;
    }));
  }

  checkAccount(): Observable<any> {
    return this.http.get('/api/profile/check', {responseType: 'text'});
  }

  refreshToken(): Observable<any> {
    this.refreshTokenPayload.userName = this.getUserName();
    this.refreshTokenPayload.refreshToken = this.getRefreshToken();
    return this.http.post<LoginResponse>('/api/auth/refresh/token',
      this.refreshTokenPayload)
      .pipe(tap(response => {
        this.localStorage.clear('authenticationToken');
        this.localStorage.clear('expiresAt');

        this.localStorage.store('authenticationToken',
          response.authenticationToken);
        this.localStorage.store('expiresAt', response.expiresAt);
      }));
  }

  register(registerRequest: RegisterRequest): Observable<any> {
    return this.http.post('/api/auth/register', registerRequest, {responseType: 'text'});
  }

  confirmEmail(token: string): Observable<any> {
    return this.http.get('/api/auth/accountVerification/' + token, {responseType: 'text'});
  }

  forgotPassword(forgotPasswordRequest: ForgotPasswordRequest): Observable<any> {
    return this.http.post('/api/auth/forgotPassword', forgotPasswordRequest, {responseType: 'text'});
  }

  resetPassword(token: string): Observable<any> {
    return this.http.get('/api/auth/passwordVerification/' + token, {responseType: 'text'});
  }

  editPassword(resetPasswordRequest: ResetPasswordRequest): Observable<any> {
    return this.http.post('/api/auth/editPassword', resetPasswordRequest, {responseType: 'text'});
  }

  logout() {
    this.refreshTokenPayload.userName = this.getUserName();
    this.refreshTokenPayload.refreshToken = this.getRefreshToken();
    this.http.post('/api/auth/logout', this.refreshTokenPayload,
      {responseType: 'text'})
      .subscribe(data => {
      }, error => {
        throwError(error);
      });
    this.localStorage.clear('authenticationToken');
    this.localStorage.clear('userName');
    this.localStorage.clear('refreshToken');
    this.localStorage.clear('expiresAt');
    this.localStorage.clear('role');
    this.localStorage.clear('image');
  }

  refreshTokenPayload = {
    refreshToken: this.getRefreshToken(),
    userName: this.getUserName()
  }

  getUserName() {
    return this.localStorage.retrieve('userName');
  }

  getRefreshToken() {
    return this.localStorage.retrieve('refreshToken');
  }

  getJwtToken() {
    return this.localStorage.retrieve('authenticationToken');
  }

  getRole() {
    return this.localStorage.retrieve('role');
  }

  getImage() {
    return this.localStorage.retrieve('image');
  }

  isLoggedIn(): boolean {
    return this.getJwtToken() != null;
  }

}



