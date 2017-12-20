import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { ToastController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: "page-wall",
  templateUrl: "wall.html"
})
export class WallPage {
  gid: any;
  group:any;
  uid:any;
  member:any;
  pending:any;
  message:any = "";
  user:any;
  avatar:any;
  name:any;
  messages:any;
  owner:any;
  constructor(public toastCtrl: ToastController, public auth: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase) {
    this.gid = this.navParams.get("gid");
    this.group = this.db.object('/groups/'+this.gid).valueChanges();
   let a = this.auth.authState.subscribe((snapshot) => {
      if(snapshot != null) {
        this.user = this.db.object('/users/'+this.auth.auth.currentUser.uid).valueChanges().subscribe((snapshot) => {
          this.avatar = snapshot["avatar"];
          this.name = snapshot["name"];
          a.unsubscribe();
        });
      }
    })
    this.messages = this.db.list('/groups/'+this.gid+'/messages', ref => ref.orderByChild('reversedate')
).valueChanges();
    this.db.object('/groups/'+this.gid).valueChanges().subscribe((snapshot) => {
      let a = this.auth.authState.subscribe((snapshot) => {
        if (snapshot) {
          this.owner = snapshot["owner"]==this.auth.auth.currentUser.uid ;
        }
        a.unsubscribe();
      });

    });
    this.imMember();
  }

  imOwner() {
    return this.owner;
  }

  sendMessage(event:any) {
    let date =  Date.now();
    this.db.list('/groups/'+this.gid+'/messages').push({
      message: this.message,
      avatar: this.avatar,
      sender: this.name,
      date: date,
      reversedate: 0-date,
      gid: this.gid
    });
    this.message = "";
  }

  imMember() {
   var subs = this.auth.authState.subscribe((user) => {
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
          subs.unsubscribe();
        })
      }
    })
  }



apply() {
    let usersub = this.auth.authState.subscribe((user) => {
      let gsup = this.db.object('/groups/'+this.gid).valueChanges().subscribe((group) => {
        let send = this.db.object('/users/'+user.uid).valueChanges().subscribe((sender) => {
          this.db.list('/users/'+(group as any).owner+'/notifications/requests').push({
            sender: (sender as any).uid,
            message: "El usuario "+(sender as any).name+" ha solicitado entrar al grupo "+(group as any).name,
            receiver: (group as any).owner,
            reverse: Date.now(),
            gid : this.gid,
            type: "req"
          }).then((item) => {
            this.db.object('/users/'+(group as any).owner+'/notifications/requests/'+item.key).update({
              id: item.key
            })
          })
          this.db.object('/groups/'+this.gid+'/requests').set({
            [(sender as any).uid] : true
          })
          usersub.unsubscribe();
          gsup.unsubscribe();
          send.unsubscribe();
        })
      });
    })
    this.pending = true;
    let toast = this.toastCtrl.create({
      message: 'Petición enviada correctamente',
      duration: 2000,
      position:'middle'
    });
    toast.present();
  }


}
