import {Component} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  public isMenuCollapsed = true;

  // tslint:disable-next-line:no-shadowed-variable
  constructor(public auth: AngularFireAuth) { }

  // tslint:disable-next-line:typedef
  login() {
    this.auth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  // tslint:disable-next-line:typedef
  logout() {
    this.auth.auth.signOut();
  }

}
