import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupLogPage } from './group-log';

@NgModule({
  declarations: [
    GroupLogPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupLogPage),
  ],
})
export class GroupLogPageModule {}
