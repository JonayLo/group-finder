import { GroupPage } from './../group/group';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertController } from 'ionic-angular';
import * as firebase from 'firebase/app';
import 'firebase/storage';




@IonicPage()
@Component({
  selector: 'page-create-group',
  templateUrl: 'create-group.html',
})
export class CreateGroupPage {
asignaturas:any;
form: FormGroup;
id:any;
members: any;
asig:any;
codigo:any;
  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase,
    public auth: AngularFireAuth, public fb: FormBuilder) {
      this.asignaturas = db.list('/asignaturas').valueChanges();
      this.form = this.fb.group({
        name: ["", Validators.required],
        asignatura: ["", Validators.required],
        desc: ["", Validators.required],
        pr: [false, Validators.required]
      })
      this.id = this.auth.auth.currentUser.uid;
  }

  cod() {
   this.codigo = this.db.object('/asignaturas/'+this.asig).valueChanges().subscribe((snapshot) => {
     this.codigo = snapshot["cod"];
       });
  }

  createGroup() {
    this.db.list('/groups').push({
      name : this.form.value.name,
      desc : this.form.value.desc,
      asignatura : this.form.value.asignatura,
      cod: this.codigo,
      private: this.form.value.pr,
      owner : this.auth.auth.currentUser.uid,
      miembros : { [this.auth.auth.currentUser.uid] : true }
        }).then((item) => {
      this.db.object('/groups/'+item.key).update({
        id : item.key
      });
      this.db.object('/users/'+this.auth.auth.currentUser.uid+'/groups').update({[item.key] : true});
      let confirm = this.alertCtrl.create({
        title: 'Grupo creado',
        message: 'Grupo creado de forma correcta',
        buttons: [{
          text: 'Ok',
          handler: () => {
            this.navCtrl.push(GroupPage, {gid:item.key});
          }
        }]
      });
      confirm.present();
    });
  }


}
