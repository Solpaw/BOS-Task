import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUserModel } from '../models/user.models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl: string = 'https://620e9760ec8b2ee28326ae84.mockapi.io/api/1';
  public pageSize: number = 10;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<IUserModel[]> {
    const url = this.baseUrl + '/users';

    return this.http.get<IUserModel[]>(url);
  }
}
