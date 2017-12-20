
import { GroupLogPage } from '../pages/group-log/group-log';
import { GroupFinderPage } from './../pages/group-finder/group-finder';
import { NotificationsPage } from '../pages/notifications/notifications';
import { LoginPage } from './../pages/login/login';
import { GroupRepositoryPage } from '../pages/group-repository/group-repository';
import { MembersPage } from './../pages/members/members';
import { GroupPage } from './../pages/group/group';
import { GroupsPage } from './../pages/groups/groups';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicErrorHandler, IonicModule, ModalController, ActionSheetController } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { UserViewPage } from '../pages/user-view/user-view';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import  {AngularFireModule}  from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase} from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { CreateGroupPage } from '../pages/create-group/create-group';
import { WallPage } from '../pages/wall/wall';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { MyGroupsPage } from '../pages/my-groups/my-groups';
import { SubjectSearchersPage } from '../pages/subject-searchers/subject-searchers';
import { ApadrinaPage } from '../pages/apadrina/apadrina';
import { IonicStorageModule } from '@ionic/storage';






export const firebaseConfig = {
  apiKey: "AIzaSyCAKQhOWH8NvJZJOUTjvvD15QaRdJo2vvw",
  authDomain: "ulpgc-study-groups-finder.firebaseapp.com",
  databaseURL: "https://ulpgc-study-groups-finder.firebaseio.com",
  projectId: "ulpgc-study-groups-finder",
  storageBucket: "ulpgc-study-groups-finder.appspot.com",
  messagingSenderId: "159967459674"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MembersPage,
    GroupLogPage,
    ApadrinaPage,
    SubjectSearchersPage,
    GroupsPage,
    GroupFinderPage,
    LoginPage,
    NotificationsPage,
    MyGroupsPage,
    GroupPage,
    GroupRepositoryPage,
    UserViewPage,
    WallPage,
    CreateGroupPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    IonicStorageModule.forRoot(),
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    GroupPage,
    MembersPage,
    SubjectSearchersPage,
    LoginPage,
    GroupFinderPage,
    ApadrinaPage,
    MyGroupsPage,
    GroupLogPage,
    WallPage,
    NotificationsPage,
    HomePage,
    GroupRepositoryPage,
    GroupsPage,
    UserViewPage,
    CreateGroupPage
  ],
  providers: [
    StatusBar,
    FileTransfer,
    File,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
