import { GroupFinderPage } from '../group-finder/group-finder';
import { GroupPage } from '../group/group';
import { CreateGroupPage } from './../create-group/create-group';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';



/**
 * Generated class for the GroupsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html',
})
export class GroupsPage {
  groups: any;
  asignatura:any;
  asignaturas:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public afAuth: AngularFireAuth,
  public db: AngularFireDatabase) {
    this.groups = db.list('/groups').valueChanges();
    this.asignaturas = db.list('/asignaturas').valueChanges();
  }

  groupsFilter()  {
    if (this.asignatura == "all") {
      this.groups = this.db.list('/groups').valueChanges();
    } else {
      this.groups = this.db.list('/groups', ref => ref.orderByChild('asignatura').equalTo(this.asignatura)).valueChanges();
    }
  }

  goToAdd() {
    this.navCtrl.push(CreateGroupPage);
  }

  goToGroup(id) {
    this.navCtrl.push(GroupPage, {
      gid: id
    });
  }

groupSearcher() {
  this.navCtrl.push(GroupFinderPage);
}


}
