import {Injectable} from '@angular/core';
import {App} from "ionic-angular";
import {INotification} from "../interfaces/notification";
import {ChatPage} from "../pages/chat/chat";
import {HomePage} from "../pages/home/home";
import {Api} from "./api";

@Injectable()

export class Nav {

  constructor(
    public app: App,
    public api: Api
  ) {
  }

  public root(page, params?, direction: string = 'forward') {

    return this.app.getActiveNavs()[0].setRoot(page, params, {
      animate: true,
      direction: direction
    });
  }

  public push(page, params?) {

    return this.app.getActiveNavs()[0].push(page, params, {
      animate: true,
      direction: 'forward'
    })
  }

  public pop() {
    this.app.getActiveNavs()[0].pop();
  }

  public notification(notification: INotification) {

    switch (notification.destination) {

      case 'chat':
        this.root(ChatPage, {chatRoom: notification.data});
        break;

      case 'home-task':
        this.root(HomePage, {homeTask: notification.data});
        break;
    }

    this.api.maskAsRead(notification);
  }

  public lazy(page: string) {

    switch (page) {

      case 'home':
        this.root(HomePage);
        break;

      case 'chat':
        this.root(ChatPage);
        break;
    }
  }
}
