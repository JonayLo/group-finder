import {GroupPage} from '../group/group';
import { AngularFireAuth } from "angularfire2/auth";
import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { AngularFireDatabase } from "angularfire2/database";
import { LoadingController } from "ionic-angular";
import * as firebase from "firebase/app";
import "firebase/storage";

@Component({
  selector: "page-user-view",
  templateUrl: "user-view.html"
})
export class UserViewPage {
  uid: any;
  asignaturas: any;
  user: any;
  own: any;
  groups:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase,
    public loadingCtrl: LoadingController
  ) {
    if (!this.navParams.get("uid")) {
      this.afAuth.authState.subscribe(user => {
        if (user) {
          this.uid = user.uid;
          this.user = db.object("/users/" + this.uid).valueChanges();
          this.asignaturas = db
            .list("/users/" + this.uid + "/Asignaturas")
            .valueChanges();
            this.groups = this.db.list('/groups/', ref => ref.orderByChild('miembros/'+this.uid).equalTo(true)).valueChanges();
        }
      });
    } else {
      this.afAuth.authState.subscribe(user => {
        this.uid = this.navParams.get("uid");
        this.user = db.object("/users/" + this.uid).valueChanges();
        this.asignaturas = db
          .list("/users/" + this.uid + "/Asignaturas")
          .valueChanges();
          this.groups = this.db.list('/groups/', ref => ref.orderByChild('miembros/'+this.uid).equalTo(true)).valueChanges();
      })
    }
    this.ownProfile();

  }

  changePic() {
    var file_button = document.getElementById("ppic");
    file_button.click();
  }

  goToGroup(id:any) {
    this.navCtrl.push(GroupPage, {gid:id});
  }


  uploadPic(event: any) {
    let loader = this.loadingCtrl.create({
      content: "Uploading Photo"
    });
    loader.present();
    var file: File = event.target.files[0];
    const medaTada = { contentType: file.type };
    const storeRef: firebase.storage.Reference = firebase
      .storage()
      .ref("/users/" + this.uid + "/profile");
    storeRef.put(file, medaTada).then(snapshot => {
      this.db
        .object("/users/" + this.uid)
        .update({ avatar: snapshot.downloadURL });
      loader.dismiss();
    });
  }

  ownProfile() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        if (user.uid == this.uid) {
          this.own = true;
        } else {
          this.own = false;
        }
      }
    });
  }
}
