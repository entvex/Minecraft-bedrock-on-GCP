import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import { auth } from 'firebase/app';
import {GcpService} from '../shared/services/gcp.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // tslint:disable-next-line:no-shadowed-variable
  constructor(public auth: AngularFireAuth, private gcpService: GcpService) { }

  // tslint:disable-next-line:typedef
  login() {
    // tslint:disable-next-line:max-line-length
    this.auth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then(value => this.gcpService.GetServerCheckClaims().subscribe( res => console.log(res) ));

  }
  // tslint:disable-next-line:typedef
  logout() {
    this.auth.auth.signOut();
  }

  ngOnInit(): void {
  }

}
