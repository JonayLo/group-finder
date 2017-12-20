import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


/**
 * Generated class for the GroupLogPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-group-log',
  templateUrl: 'group-log.html',
})
export class GroupLogPage {
  gid:any;
  logs:any;
  constructor(public db:AngularFireDatabase, public auth: AngularFireAuth,public navCtrl: NavController, public navParams: NavParams) {
    this.gid = this.navParams.get('gid');
    this.logs = this.db.list('/groups/'+this.gid+'/log', ref=> ref.orderByChild('reversedate')).valueChanges();
    console.log(this.logs);
  }



}
