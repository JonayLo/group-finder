
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { GroupPage } from '../group/group';




@IonicPage()
@Component({
  selector: 'page-apadrina',
  templateUrl: 'apadrina.html',
})
export class ApadrinaPage {
apadrina:any;
form: FormGroup;
groups:any;
user:any;

  constructor(public alertCtrl:AlertController, public auth: AngularFireAuth ,public navCtrl: NavController, public navParams: NavParams, public fb:FormBuilder, public db: AngularFireDatabase) {
    this.apadrina = "Padrinos";
    this.form = this.fb.group({
      desc: ["", Validators.required],
    });
    this.user = db.object("/users/" + this.auth.auth.currentUser.uid).valueChanges();
    this.groups = this.db.list('/groups', ref => ref.orderByChild('asignatura').equalTo("mentor")).valueChanges();
  }

  ionViewWillEnter(){
    this.apadrina = "Padrinos";
    }

    createGroup() {
      let usub = this.auth.authState.subscribe((snapshot) => {
      let sub =  this.db.object('/users/'+snapshot.uid).valueChanges().subscribe((user) => {
        this.db.list('/groups').push({
          name : "Grupo mentor "+user["name"],
          desc : this.form.value.desc,
          asignatura : "mentor",
          cod: "ME",
          private: true,
          owner : this.auth.auth.currentUser.uid,
          miembros : { [this.auth.auth.currentUser.uid] : true }
            }).then((item) => {
          this.db.object('/groups/'+item.key).update({
            id : item.key
          });
          this.db.object('/users/'+this.auth.auth.currentUser.uid+'/groups').update({
            [item.key] : true
          });
          this.db.object('/users/'+this.auth.auth.currentUser.uid).update({
            mentor : true
          });
          let confirm = this.alertCtrl.create({
            title: 'Inscripción correcta',
            message: 'Se ha inscrito de forma correcta',
            buttons: [{
              text: 'Ok',
              handler: () => {
                this.navCtrl.push(GroupPage, {gid:item.key});
              }
            }]
          });
          confirm.present();
        });
        usub.unsubscribe();
        sub.unsubscribe();
        });
      });
    }

    goToGroup(id:any) {
      this.navCtrl.push(GroupPage, {gid:id});
    }

    leave() {
      this.db.object("/users/" + this.auth.auth.currentUser.uid).update({mentor: false}).then(() => {
        let confirm = this.alertCtrl.create({
          title: 'Confirmación',
          message: 'Ha abandonado el programa Apadrina de forma correcta',
          buttons: [{
            text: 'Ok'
          }]
        });
        confirm.present();
      })
    }

}
