import { AngularFireDatabase } from "angularfire2/database";
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController
} from "ionic-angular";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from "firebase/app";
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';



@IonicPage()
@Component({
  selector: "page-group-repository",
  templateUrl: "group-repository.html"
})
export class GroupRepositoryPage {
  dirName: any = "";
  actualDir: any = "/files";
  hidden: boolean = true;
  gid: any;
  files: any;
  uid:any;
  user:any;
  parent:any;
  group:any;
  member:any;
  rutaname: any = "";
  root:any = true;
  constructor(
    public db: AngularFireDatabase,
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AngularFireAuth,
    public loadingCtrl: LoadingController,
    public transfer: FileTransfer,
    private file: File
  ) {
    this.gid = navParams.get("gid");
    this.group = this.db.object('/groups/'+this.gid).valueChanges();
    this.files = this.db.list("/groups/" + this.gid + "/files").valueChanges();

  }

  showInput() {
    this.hidden = !this.hidden;
  }

  openInput() {
    var file_button = document.getElementById("fileInput");
    file_button.click();
  }

  uploadFile(event: any) {
    let loader = this.loadingCtrl.create({
      content: "Subiendo archivo"
    });
    loader.present();
    var file: File = event.target.files[0];
    const medaTada = { contentType: (file as any).type };
    const storeRef: firebase.storage.Reference = firebase
      .storage()
      .ref("/groups/" + this.gid + "/" + (file as any).name);
    storeRef.put(file, medaTada).then(snapshot => {
      this.db.list("/groups/" + this.gid + this.actualDir).push({
        filename: (file as any).name,
        url: snapshot.downloadURL,
        type: "document"
      }).then((item) => {
        this.db.object("/groups/" + this.gid + this.actualDir+'/'+item.key).update({id : item.key});
      });

      this.auth.authState.subscribe((usersna) => {
        if (usersna) {
          var file: File = event.target.files[0];
          this.db.object("/users/" + usersna.uid).valueChanges().subscribe((user) => {
            this.db.list("/groups/" + this.gid + '/log').push({
              message: "El usuario "+(user as any).name+" ha subido "+(file as any).name,
              date: Date.now(),
              reversedate: 0-Date.now(),
              type: "upload",
              color:"green"
            });
          })
        }
      })
      loader.dismiss();
    });
  }

  createDir() {
    this.db.list("/groups/" + this.gid + this.actualDir).push({
      filename: this.dirName,
      type: "folder",
      parent: this.actualDir
    }).then((snapshot) => {
      this.db.object("/groups/" + this.gid + this.actualDir+'/'+snapshot.key).update({
        id: snapshot.key,
        filepath: this.actualDir + "/" + snapshot.key + "/files",
        rutaname: this.rutaname + '/'+ this.dirName
      })
      this.dirName = "";
    });
    this.hidden = !this.hidden;
  }

  downloadFile(file) {
    var a = document.createElement("a");
    a.href = file.url;
    a.target = "_blank";
    a.download = file.filename;
    document.body.appendChild(a);
    a.click();
    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.download(file.url, this.file.externalRootDirectory + 'Download/'+ file.filename, true).then((entry) =>
    {
            alert('Descarga completada en: ' + entry.toURL());
    },
  (error) => {
            alert(error);
  });;
  let usub =    this.auth.authState.subscribe((usersna) => {
    if (usersna) {
      let obsub =  this.db.object("/users/" + usersna.uid).valueChanges().subscribe((user) => {
      this.db.list("/groups/" + this.gid + '/log').push({
        message: "El usuario "+(user as any).name+" ha descargado "+(file as any).filename,
        date: Date.now(),
        reversedate: 0-Date.now(),
        type: "download",
        color: "green"
      });
    })
  }
  })
}

  changeDir(file){
    this.files = this.db.list('/groups/'+this.gid+file.filepath).valueChanges();
    this.actualDir = file.filepath;
    this.parent = file.parent;
    this.rutaname = file.rutaname;
    if (this.actualDir == "/files") {
      this.root = true;
    } else {
      this.root = false ;
    }
  }

  itemClick(file) {
    if (file.type == "document") {
      this.downloadFile(file);
    } else {
      this.changeDir(file);
    }
  }

  goBack() {
    this.actualDir = this.parent;
    var to = this.actualDir.lastIndexOf('/');
    to = to == -1 ? this.actualDir.length : to + 1;
    var object = this.actualDir.substring(0, to);
    this.files =  this.db.list('/groups/'+this.gid+this.parent).valueChanges();
    this.db.object('/groups/'+this.gid+object).valueChanges().subscribe((snapshot) => {
      this.rutaname = snapshot["rutaname"];
      if (this.actualDir == "/files") {
        this.root = true;
      } else {
        this.root = false ;
        this.parent = snapshot["parent"];
      }
    });
  }

  deleteFile(file:any) {
    this.auth.authState.subscribe((usersna) => {
      if (usersna) {
        this.db.object("/users/" + usersna.uid).valueChanges().subscribe((user) => {
          this.db.list("/groups/" + this.gid + '/log').push({
            message: "El admin "+(user as any).name+" ha borrado el archivo "+(file as any).filename,
            date: Date.now(),
            reversedate: 0-Date.now(),
            type: "trash",
            color:"danger"
          });
        })
      }
    })
    firebase.storage().refFromURL((file as any).url).delete().then(() => {
      this.db.object("/groups/" + this.gid + this.actualDir+'/'+(file as any).id).remove();
    });
  }


}
