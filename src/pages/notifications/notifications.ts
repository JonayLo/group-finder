import { UserViewPage } from './../user-view/user-view';
import { AngularFireObject } from 'angularfire2/database/interfaces';
import { Observable, Subject } from "rxjs/Rx";
import { AngularFireDatabase } from "angularfire2/database";

import { AngularFireAuth } from "angularfire2/auth";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

/**
 * Generated class for the NotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-notifications",
  templateUrl: "notifications.html"
})
export class NotificationsPage {
  requests: any;
  notifications: any;
  images: Subject<any>;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase,
    public auth: AngularFireAuth
  ) {
    this.images = new Subject();
    let usub = this.auth.authState.subscribe(user => {
      this.requests = db
        .list("/users/" + user.uid + "/notifications/requests", ref =>
          ref.orderByChild("reverse")
        )
        .valueChanges();
      db
        .list("/users/" + user.uid + "/notifications/requests")
        .valueChanges()
        .subscribe(snapshot => {
          snapshot.forEach(element => {
            this.images.next({ photos: { [(element as any).sender]: "3" } });
          });
        });
      usub.unsubscribe();
    });
  }

  senderPhoto(req: any) {
    if (req == null) {
      return;
    }
    this.images[3] = this.db
      .object("/users/" + (req as any).sender)
      .valueChanges();
  }

  req(request: any) {
    if ((request as any).type == "apply") {
      return true;
    } else {
      return false;
    }
  }

  admitir(uid: any, gid: any, notification) {
    this.db.object("/groups/" + gid + "/miembros").update({
      [uid]: true
    });
    this.db.object("/groups/" + gid + "/requests/"+notification.sender).remove();
    this.db.object("/users/" + uid + "/groups").update({
      [gid]: true
    });
    let usub = this.auth.authState.subscribe((user) => {
      this.db.object("/users/" + user.uid + "/notifications/requests/"+notification.id).remove();
      usub.unsubscribe();
    });
       let logsub=  this.db.object("/users/" + uid).valueChanges().subscribe((user) => {
          this.db.list("/groups/" + gid + '/log').push({
            message: "El usuario "+(user as any).name+" se ha unido al grupo",
            date: Date.now(),
            reversedate: 0-Date.now(),
            type: "sign-in",
            color:"green"
          });
          logsub.unsubscribe();
        })
    }

  rechazar(uid:any, gid:any, notification:any) {
    let usub = this.auth.authState.subscribe((user) => {
      this.db.object("/users/" + user.uid + "/notifications/requests/"+notification.id).remove();
      usub.unsubscribe();
    });
    this.db.object("/groups/" + gid + "/requests/"+notification.sender).remove();
  }

  goToUser(uid:any) {
    if ((uid as any).type=="inv") {
      this.navCtrl.push(UserViewPage, {uid: [(uid as any).receiver]});
    } else {
      this.navCtrl.push(UserViewPage, {uid: [(uid as any).sender]});
    }
  }
}
