import { ApadrinaPage } from '../apadrina/apadrina';
import { GroupsPage } from './../groups/groups';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GroupPage } from '../group/group';


/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
grupo:any;
logs:any;
gid;
  constructor(public db: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams, public auth: AngularFireAuth) {
    let usubs = this.auth.authState.subscribe((user) => {
      if (user) {
        this.grupo = this.db.list('/groups', ref => ref.orderByChild('miembros/'+user.uid).equalTo(true).limitToFirst(1)).valueChanges();
          let gsub = this.grupo.subscribe((group) => {
            this.logs = this.db.list('/groups/'+group[0].id+'/log', ref => ref.orderByChild('reversedate').limitToFirst(3)).valueChanges();
            console.log(this.logs);
            this.gid = group[0].id;
            gsub.unsubscribe();
            usubs.unsubscribe();
          })
      }
    })
  }



  goToGroup(id:any) {
    this.navCtrl.push(GroupPage, {gid:id});
  }

  goToApadrina() {
    this.navCtrl.push(ApadrinaPage);
  }
}
