import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {StatusBar} from "@ionic-native/status-bar";
import {Modal} from "../providers/modal";
import {Loader} from "../providers/loader";
import {Api} from "../providers/api";
import {Cache} from "../providers/cache";
import {HttpClientModule} from "@angular/common/http";
import {LoginPage} from "../pages/login/login";
import {Nav} from "../providers/nav";
import {ComponentsModule} from "../components/components.module";
import {PipesModule} from "../pipes/pipes.module";
import {ChatPage} from "../pages/chat/chat";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    ChatPage,
  ],
  imports: [
    BrowserModule,
    ComponentsModule,
    HttpClientModule,
    IonicModule,
    IonicModule.forRoot(MyApp),
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    ChatPage,
  ],
  providers: [
    StatusBar,
    Modal,
    Loader,
    Api,
    Cache,
    Nav,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
