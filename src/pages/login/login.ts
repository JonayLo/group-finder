import { AngularFireAuth } from 'angularfire2/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private form : FormGroup;
  constructor(public storage: Storage, public viewCtrl: ViewController,private formBuilder: FormBuilder,private auth: AngularFireAuth, public navCtrl: NavController, public alertCtrl: AlertController) {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

  }

  login() {
    this.auth.auth.signInWithEmailAndPassword(this.form.value.email, this.form.value.password).then(() => {this.auth.authState.subscribe((user) => {
      this.storage.set('email', this.form.value.email);
      this.storage.set('pw', this.form.value.password);
      this.viewCtrl.dismiss();
    })
    })
      .catch((error) => { this.errorAlert(error);
      });
  }

  errorAlert(error){
    let alert = this.alertCtrl.create({
      title: 'Error',
      message: error.message,
      buttons: ['OK']
    });
    alert.present();
  }
}



