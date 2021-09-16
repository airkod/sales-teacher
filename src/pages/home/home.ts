import {Component} from '@angular/core';
import {Api} from "../../providers/api";
import {Firebase} from "../../providers/firebase";
import {IHomeTask} from "../../interfaces/home-task";
import {Loader} from "../../providers/loader";
import {Modal} from "../../providers/modal";
import {NavParams} from "ionic-angular";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  homeTasks: Array<IHomeTask> = [];
  homeTask: IHomeTask = null;

  comment: string = '';
  assessment: number;

  constructor(
    public api: Api,
    public modal: Modal,
    public params: NavParams
  ) {
    Firebase.getToken().then((token: string) => {
      this.api.updateToken(token);
    }).catch((e) => {
    });

    this.homeTask = params.get('homeTask');

    this.update();
  }

  update() {
    this.api.homeTasks().then((homeTasks: Array<IHomeTask>) => {

      this.homeTasks = homeTasks;

      if (!this.homeTask && this.homeTasks.length) {
        this.homeTask = this.homeTasks[0];
      }
    });
  }

  submit() {

    Loader.show();

    this.api
      .submitAssessment(this.homeTask.id, this.assessment, this.comment)
      .then((homeTask: IHomeTask) => {

        this.assessment = null;
        this.comment = null;

        Loader.hide();

        this.homeTask = homeTask;
        this.update();
        this.modal.message('Отлично! Оценка успешно отправленна.');
      })
      .catch(() => {
        Loader.hide();
        this.modal.message('Что-то пошло не так.');
      });
  }
}
