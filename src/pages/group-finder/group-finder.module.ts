import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupFinderPage } from './group-finder';

@NgModule({
  declarations: [
    GroupFinderPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupFinderPage),
  ],
})
export class GroupFinderPageModule {}
