import { GroupRepositoryPage } from './../group-repository/group-repository';
import { MembersPage } from './../members/members';
import { WallPage } from '../wall/wall';
import { UserViewPage } from './../user-view/user-view';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';








@IonicPage()
@Component({
  selector: 'page-group',
  templateUrl: 'group.html',
})

export class GroupPage {
gid:any;
group:any;
tab1:any;
tab2:any;
tab3:any;
uid:any;
member:any;
params:any;
  constructor(public auth: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase) {
    this.params = navParams;
    this.tab1 = WallPage;
    this.gid = navParams.get('gid');
    this.tab2 = GroupRepositoryPage;
    this.tab3 = MembersPage;
    this.imMember();
  }

  imMember() {
   let subs = this.auth.authState.subscribe((user) => {
      if (user) {
        this.uid = user.uid;
        this.db.object("/groups/" + this.gid + '/miembros').valueChanges().subscribe((snapshot) => {
          if(!snapshot) {
            this.member=false;
            subs.unsubscribe();
            return;
          }
          if(snapshot[this.uid]) {
            this.member = true ;
          } else {
            this.member = false;
          }
        })
      }
    })
  }



}




