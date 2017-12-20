import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the GroupFinderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-group-finder',
  templateUrl: 'group-finder.html',
})
export class GroupFinderPage {
asignaturas:any;
user:any;
userasigs;
  constructor(public auth: AngularFireAuth, public db: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
    let usub = this.auth.authState.subscribe((user) => {
      if (user) {
        this.asignaturas = this.db.list("/users/"+user.uid+"/Asignaturas").valueChanges();
        this.user = this.db.object("/users/"+user.uid).valueChanges();
        this.userasigs =  this.db.object("/users/"+user.uid+'/searching').valueChanges();
      }
      usub.unsubscribe();
    })
  }

  toggle(event:any, asignatura:any) {
    let usub = this.auth.authState.subscribe((user) => {
      if (user) {
        this.db.object("/users/"+user.uid+'/searching').update({
          [asignatura]: event.value
        });
      }
      usub.unsubscribe();
  });
}




}
