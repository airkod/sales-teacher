import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Cache} from "./cache";
import {Loader} from "./loader";
import {Config} from "../config";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Profile} from "./profile";
import {IUser} from "../interfaces/user";
import {INotification} from "../interfaces/notification";
import {Form} from "./form";
import {IChat} from "../interfaces/chat";
import {IChatRoom} from "./chat-room";

@Injectable()

export class Api {

  headers: any = {};
  user: IUser;

  constructor(
    public http: HttpClient,
  ) {
    Profile.listen((user: IUser) => {
      this.user = user;
      this.headers = {'x-user': user.id};
    });
  }

  /////////////////////////////////////////////////////////////////////////
  // Accounting
  /////////////////////////////////////////////////////////////////////////

  auth(email: string, password: string) {
    return this.post(`account/auth`, {
      email: email,
      password: password
    });
  }

  updateToken(token: string) {
    return this.post(`account/token`, {token: token, teacherId: this.user.id}, false);
  }

  /////////////////////////////////////////////////////////////////////////
  // Notifications
  /////////////////////////////////////////////////////////////////////////

  notifications() {
    return this.get(`notification`, {}, false, false);
  }

  notification(notification: INotification) {
    return this.get(`notification/item`, {notificationId: notification});
  }

  maskAsRead(notification: INotification) {
    return this.get(`notification/maskAsRead`, {id: notification.id}, false, false);
  }

  /////////////////////////////////////////////////////////////////////////
  // Home task
  /////////////////////////////////////////////////////////////////////////

  homeTasks() {
    return this.get(`homeTask`);
  }

  submitAssessment(homeTaskId: string, assessment: number, comment: string) {

    return this.post(`homeTask/assessment`, {
      id: homeTaskId,
      assessment: assessment,
      comment: comment
    });
  }

  homeTask(homeTaskId: string) {
    return this.get(`homeTask/item`, {homeTaskId: homeTaskId});
  }

  /////////////////////////////////////////////////////////////////////////
  // Chat
  /////////////////////////////////////////////////////////////////////////

  rooms() {
    return this.get(`chat/rooms`, {}, false, false);
  }

  chat(chatRoom: IChatRoom) {
    return this.get(`chat/messages`, {chatRoom: chatRoom.id}, false, false);
  }

  chatMessage(chatRoom: IChatRoom, message: string, files: Array<File> = []) {

    if (!files.length) {
      return this.post(`chat/message`, {message: message, chatRoom: chatRoom.id}, false);
    }

    return new Promise((resolve, reject) => {

      this.upload(files).then((files: Array<string>) => {

        this.post(`chat/message`, {message: message, chatRoom: chatRoom.id, files: files}, false).then((message: IChat) => {

          resolve(message);

        }).catch(() => {
          reject();
        });

      }).catch(() => {

        reject();
      });
    });
  }

  /////////////////////////////////////////////////////////////////////////
  // Files
  /////////////////////////////////////////////////////////////////////////

  upload(files: Array<File>) {

    return new Promise((resolve, reject) => {

      let body = Form.convert({
        files: files,
        path: Config.fs.path,
        folder: this.user.id
      });

      this.http

        .post(Config.fs.url, body)

        .subscribe(
          (response: any) => {

            if (response.success) {
              resolve(response.files);
              return;
            }

            reject();
          },

          (error: any) => {

            if (error.error) {

              reject(error.error);
              return;
            }

            reject();
          }
        );
    });
  }

  /////////////////////////////////////////////////////////////////////////

  get(endpoint?: string, params?: any, cached: boolean = true, loader: boolean = true) {

    return new Promise((resolve, reject) => {

      if (cached && Config.api.cache) {

        let cacheKey = endpoint + JSON.stringify(params || {});

        let cached = Cache.get(cacheKey);

        if (cached) {
          resolve(cached);
          return;
        }
      }

      if (loader) {
        Loader.show();
      }

      this.http

        .get(Config.api.endpoint + '/' + endpoint, {
          params: params,
          headers: new HttpHeaders(this.headers),
          observe: "response"
        })

        .subscribe(
          (response: HttpResponse<any>) => {

            this.setUser(response);
            this.setNotifications(response);

            if (cached && Config.api.cache) {
              let cacheKey = endpoint + JSON.stringify(params || {});
              Cache.set(cacheKey, response.body);
            }

            if (loader) {
              Loader.hide();
            }

            resolve(response.body);
          },

          (error: HttpErrorResponse) => {
            Loader.hide();
            reject(error.error.error);
          }
        );
    });
  }

  post(endpoint: string, body: any = {}, loader: boolean = true) {

    return new Promise((resolve, reject) => {

      if (loader) {
        Loader.show();
      }

      body = Form.convert(body);

      this.http

        .post(Config.api.endpoint + '/' + endpoint, body, {
          headers: new HttpHeaders(this.headers),
          observe: "response"
        })

        .subscribe(
          (response: HttpResponse<any>) => {

            this.setUser(response);
            this.setNotifications(response);

            if (loader) {
              Loader.hide();
            }

            resolve(response.body);
          },

          (response: HttpErrorResponse) => {

            if (loader) {
              Loader.hide();
            }

            if (response.error) {
              reject(response.error);
              return;
            }
            reject();
          }
        );
    });
  }

  setUser(response: HttpResponse<IUser>) {

    let user = JSON.parse(response.headers.get('x-user'));

    if (user) {
      Profile.set(user);
    }
  }

  setNotifications(response: HttpResponse<any>) {

    let notifications = JSON.parse(response.headers.get('x-notifications'));

    if (notifications) {
      Profile.setNotifications(notifications);
    }
  }
}
