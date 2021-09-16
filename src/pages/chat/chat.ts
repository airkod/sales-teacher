import {Component} from '@angular/core';
import {IChat} from "../../interfaces/chat";
import {Api} from "../../providers/api";
import {Timer} from "../../providers/timer";
import {Loader} from "../../providers/loader";
import {Modal} from "../../providers/modal";
import {IChatRoom} from "../../providers/chat-room";
import {NavParams} from "ionic-angular";

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})

export class ChatPage {

  roomsUpdateInterval: number = 0;
  messagesUpdateInterval: number = 0;

  messages: Array<IChat> = [];
  rooms: Array<IChatRoom> = [];

  room: IChatRoom = null;

  constructor(
    public api: Api,
    public modal: Modal,
    public params: NavParams
  ) {
    this.selectRoom(params.get('chatRoom'));

    this.roomsUpdateInterval = Timer.interval(5000, true, () => {

      this.api.rooms().then((rooms: Array<IChatRoom>) => {

        this.rooms = rooms;

        if (!this.room && this.rooms.length) {
          this.selectRoom(this.rooms[0]);
        }
      });
    });
  }

  selectRoom(room: IChatRoom = null) {

    if (!room) {
      return;
    }

    this.room = room;
    this.room.notification = false;

    Timer.destroy(this.messagesUpdateInterval);

    this.messagesUpdateInterval = Timer.interval(5000, true, () => {
      this.api.chat(this.room).then((messages: Array<IChat>) => {
        this.messages = messages;
      });
    });
  }

  submit(message) {

    Loader.show();

    this.api
      .chatMessage(this.room, message.message, message.files)
      .then((message: IChat) => {
        Loader.hide();
        this.messages.push(message);
      })
      .catch(() => {
        Loader.hide();
        this.modal.message('Упс.. Неудалось отправить сообщение!');
      });
  }

  ngOnDestroy() {
    Timer.destroy(this.roomsUpdateInterval);
    Timer.destroy(this.messagesUpdateInterval);
  }
}
