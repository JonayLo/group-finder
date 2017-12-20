import { AngularFireDatabase } from 'angularfire2/database';
import { UserViewPage } from './../pages/user-view/user-view';
import { NotificationsPage } from './../pages/notifications/notifications';
import { ModalController, App } from 'ionic-angular';
import { MyGroupsPage } from '../pages/my-groups/my-groups';
import { CreateGroupPage } from './../pages/create-group/create-group';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { GroupsPage } from '../pages/groups/groups';
import { LoginPage } from '../pages/login/login';
import { Storage } from '@ionic/storage';







@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
    rootPage:any ;
    current_user: any;
    notifis:any;

  constructor(public db:AngularFireDatabase, public appCtrl: App,public modalCtrl: ModalController,platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public auth: AngularFireAuth, public storage: Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.storage.get('email').then(email => {
        this.storage.get('pw').then(pw => {
          if (email!= '' && pw!= '') {
         // this.auth.auth.signInWithEmailAndPassword(email, pw);
          }
        })
      });
    });
        this.rootPage = HomePage;
        let usub = this.auth.authState.subscribe(user => {
          this.notifis = db.list("/users/" + user.uid + "/notifications/requests", ref =>
              ref.orderByChild("reverse")
            ).valueChanges();
            usub.unsubscribe();
          });
  }

  goToGroups(params){
    this.navCtrl.push(GroupsPage);
  }

  login() {
    let modal = this.modalCtrl.create(LoginPage);
    modal.present();
  }

  logout() {
    this.auth.auth.signOut().then(() => {
      this.storage.remove('pw');
      this.storage.remove('email');
      this.rootPage = HomePage;
      this.navCtrl.setRoot(HomePage);
    });
  }

  notifications() {
    this.navCtrl.push(NotificationsPage);
  }

  goToMyGroups() {
    this.navCtrl.push(MyGroupsPage);
  }

  goToHome() {
    this.navCtrl.setRoot(HomePage);
  }

  goToProfile() {
    this.navCtrl.push(UserViewPage);
  }
}


