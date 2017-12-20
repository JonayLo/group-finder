import { UserViewPage } from './../user-view/user-view';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';






@IonicPage()
@Component({
  selector: 'page-subject-searchers',
  templateUrl: 'subject-searchers.html',
})
export class SubjectSearchersPage {
users:any;
gid:any;
  constructor(public toast:ToastController, public actionSheetCtrl: ActionSheetController, public db: AngularFireDatabase, public auth:AngularFireAuth,public navCtrl: NavController, public navParams: NavParams) {
    this.gid = navParams.get('gid');
   let gsub = this.db.object('/groups/'+this.gid).valueChanges().subscribe((snapshot) => {
      this.users = this.db.list('/users', ref => ref.orderByChild('searching/'+(snapshot as any).asignatura).equalTo(true)).valueChanges();
      gsub.unsubscribe();
    })
  }

  presentActionSheet(uid:any) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Opciones de usuario',
      buttons: [
        {
          text: "Invitar a grupo",
          handler: () => {
            let usersub = this.auth.authState.subscribe((user) => {
              let gsup = this.db.object('/groups/'+this.gid).valueChanges().subscribe((group) => {
                let send = this.db.object('/users/'+user.uid).valueChanges().subscribe((sender) => {
                  this.db.list('/users/'+uid+'/notifications/requests').push({
                    sender: uid,
                    message: "El usuario "+(sender as any).name+" le invita a entrar al grupo "+(group as any).name,
                    receiver: user.uid,
                    reverse: Date.now(),
                    gid : this.gid,
                    type: "inv"
                  }).then((item) => {
                    this.db.object('/users/'+uid+'/notifications/requests/'+item.key).update({
                      id: item.key
                    })
                  })
                  this.db.object('/groups/'+this.gid+'/requests').set({
                    [uid] : true
                  })
                  usersub.unsubscribe();
                  gsup.unsubscribe();
                  send.unsubscribe();
                })
              });
            })
          }
        },{
          text: 'Ver perfil',
          handler: () => {
          this.navCtrl.push(UserViewPage, {uid:[uid]});
          }
        },{
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    });
    actionSheet.present();
  }

  userProfile(id:any) {
    this.navCtrl.push(UserViewPage, {uid:[id]});
  }

  inviteUser(uid:any) {
    let usersub = this.auth.authState.subscribe((user) => {
      let gsup = this.db.object('/groups/'+this.gid).valueChanges().subscribe((group) => {
        if ((group as any).requests) {
          if ((group as any).requests[uid]) {
          let toast = this.toast.create({
            message: 'El usuario ya tiene una invitación pendiente',
            duration: 2000,
            position:'middle'
          });
          toast.present();
          gsup.unsubscribe();
          return;
          }
      }
        let send = this.db.object('/users/'+user.uid).valueChanges().subscribe((sender) => {
          this.db.list('/users/'+uid+'/notifications/requests').push({
            sender: uid,
            message: "El usuario "+(sender as any).name+" le invita a entrar al grupo "+(group as any).name,
            receiver: user.uid,
            reverse: Date.now(),
            gid : this.gid,
            type: "inv"
          }).then((item) => {
            this.db.object('/users/'+uid+'/notifications/requests/'+item.key).update({
              id: item.key
            })
          })
          this.db.object('/groups/'+this.gid+'/requests').update({
            [uid] : true
          })
          let toast = this.toast.create({
            message: 'Invitación enviada correctamente',
            duration: 2000,
            position:'middle'
          });
          toast.present();
          usersub.unsubscribe();
          gsup.unsubscribe();
          send.unsubscribe();
        })
      });
    })
  }

  isInGroup(user:any) {
    if ((user as any).groups) {
      if (((user as any).groups)[this.gid]) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }


}
