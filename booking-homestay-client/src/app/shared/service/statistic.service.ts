import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProfileResponse} from "../model/profile/profile.response";
import {AccountResponse} from "../model/statistics/account.response";
import {TimeRequest} from "../model/statistics/time.request";

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  constructor(private http: HttpClient) {
  }

  getAccount(): Observable<Array<AccountResponse>> {
    return this.http.get<Array<AccountResponse>>('/api/admin/statistics/allaccount');
  }

  getHomeStay(timeRequest: TimeRequest): Observable<Array<AccountResponse>> {
    return this.http.post<Array<AccountResponse>>('/api/admin/statistics/homestay', timeRequest);
  }

}
