import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubjectSearchersPage } from './subject-searchers';

@NgModule({
  declarations: [
    SubjectSearchersPage,
  ],
  imports: [
    IonicPageModule.forChild(SubjectSearchersPage),
  ],
})
export class SubjectSearchersPageModule {}
