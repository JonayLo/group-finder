
import { AngularFireAuth } from 'angularfire2/auth';
import { UserViewPage } from './../user-view/user-view';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import {App} from "ionic-angular";
import { GroupLogPage } from '../group-log/group-log';
import { SubjectSearchersPage } from '../subject-searchers/subject-searchers';
import { HomePage } from '../home/home';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';




@IonicPage()
@Component({
  selector: 'page-members',
  templateUrl: 'members.html',
})
export class MembersPage {
  users:any;
  gid:any;
  group:any;
  constructor(public alertCtrl: AlertController, public auth: AngularFireAuth, public appCtrl: App, public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase) {
    this.gid = navParams.get('gid');
    this.group = this.db.object('/groups/'+this.gid).valueChanges();
    let usub = this.auth.authState.subscribe(user => {
      if (user) {
        this.users = this.db.list('/users/', ref => ref.orderByChild('groups/'+this.gid).equalTo(true)).valueChanges();
        usub.unsubscribe();
      }
    })
  }

goToProfile(id){
  this.appCtrl.getRootNav().push(UserViewPage, {uid: id});
}

goToLog() {
  this.navCtrl.push(GroupLogPage, {gid: [this.gid]});
}

goToSearchers() {
  this.navCtrl.push(SubjectSearchersPage, {gid:[this.gid]});
}

removeUser(id:any) {
  this.db.object('/users/'+id+'/groups').update({[this.gid] : null });
  this.db.object('/groups/'+this.gid+'/miembros').update({[id]:null});
  let logsub = this.db.object("/users/" + id).valueChanges().subscribe((user) => {
    this.db.list("/groups/" + this.gid + '/log').push({
      message: "El usuario "+(user as any).name+" ha sido expulsado",
      date: Date.now(),
      reversedate: 0-Date.now(),
      type: "times",
      color:"danger"
     });
     logsub.unsubscribe();
  })
}

deleteGroup() {
  let alert = this.alertCtrl.create({
    title: 'Confirmar Borrado',
    message: '¿Quieres borrar este grupo? Eliminarás todo el contenido',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
      },
      {
        text: 'Confirmar',
        handler: () => {
          this.appCtrl.getRootNav().setRoot(HomePage).then(() => {
            this.db.object('/groups/'+this.gid).update({
              miembros:null,
              owner:null,
              desactivated:true,
              private:true
            });
          })
        }
      }
    ]
  });
  alert.present();
}

quitFromGroup() {
  this.db.object('/groups/'+this.gid+'/miembros').update({[ this.auth.auth.currentUser.uid] :null}).then(() => {
    this.appCtrl.getRootNav().push(HomePage);
  });
  this.db.object('/users/'+this.auth.auth.currentUser.uid+'/groups').update({[this.gid] : null });
}

}
