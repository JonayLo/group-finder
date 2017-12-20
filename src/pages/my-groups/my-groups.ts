import { GroupPage } from './../group/group';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';





@IonicPage()
@Component({
  selector: 'page-my-groups',
  templateUrl: 'my-groups.html',
})
export class MyGroupsPage {
groups:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase, public auth:AngularFireAuth) {
    this.auth.authState.subscribe((user)=> {
      this.groups = this.db.list('/groups/', ref => ref.orderByChild('miembros/'+user.uid).equalTo(true)).valueChanges();
    })

  }


goToGroup(id:any) {
  this.navCtrl.push(GroupPage, {gid:id});
}
}
