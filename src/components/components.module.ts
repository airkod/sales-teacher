import {NgModule} from '@angular/core';
import {MainMenuComponent} from './main-menu/main-menu';
import {CommonModule} from "@angular/common";
import {PipesModule} from "../pipes/pipes.module";
import {FormsModule} from "@angular/forms";
import {TrumbowygComponent} from './trumbowyg/trumbowyg';
import {ListComponent} from './list/list';
import {MessageComponent} from './message/message';

@NgModule({
  declarations: [
    MainMenuComponent,
    TrumbowygComponent,
    ListComponent,
    MessageComponent,
  ],
  imports: [
    CommonModule,
    PipesModule,
    FormsModule
  ],
  exports: [
    MainMenuComponent,
    TrumbowygComponent,
    ListComponent,
    MessageComponent,
  ]
})
export class ComponentsModule {
}
