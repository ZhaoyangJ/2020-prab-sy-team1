import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class notificationService {

  constructor(
    @Inject('apiUrl') private apiUrl,
    private http: HttpClient
  ) { }

  addNotification(obj) {
    return this.http.post(this.apiUrl + '/todo', obj);
  }

  getAllNotifications() {
    return this.http.get(this.apiUrl + '/todo');
  }

  updateNotification(obj) {
    return this.http.put(this.apiUrl + '/todo', obj);
  }

  removeNotification(id) {
    return this.http.delete(this.apiUrl + '/todo/' + id);
  }

}
