import {Component} from '@angular/core';
import {Router} from "@angular/router";
// import {Routes} from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ShareTree';

  constructor(private router:Router) {

  }

  tryItNow() {
    // console.log(this.checkCookie());
    this.router.navigate(['/tree']);
    // $('.tree-container').removeClass('invisible');
    // this.getQRCode();
  }
}
