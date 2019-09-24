import {Component, Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UUID} from 'angular2-uuid';
import {Router} from '@angular/router';
import {UtilityService} from "../utility.service";

// import * as $ from 'jquery';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

@Injectable()
export class HomeComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router, private util: UtilityService) {
  }
  title = 'ShareTree';
  urlCreator: any;
  cookieVersion = "1";

  ngOnInit() {
    // this.router.navigate(['/tree']);

    console.log(this.cookieVersion);
    if (this.util.getCookie('qrId') !== '' &&
        this.util.getCookie('version') === '' &&
        this.cookieVersion !== this.util.getCookie('version')) {
      let qrId = this.util.getCookie('qrId');
      let UUID = this.util.getCookie('UUID');
      let codeText = this.util.getCookie('codeText');
      let userDeviceId = this.util.getCookie('userDeviceId');
      this.util.setCookie('version', this.cookieVersion, 365);
      this.util.setCookie('qrId', qrId, 365);
      this.util.setCookie('UUID', UUID, 365);
      this.util.setCookie('codeText', codeText, 365);
      this.util.setCookie('userDeviceId', userDeviceId, 365);
    }
    this.util.setCookie('version', this.cookieVersion, 365);
  }

  tryItNow() {
    // console.log(this.checkCookie());
    this.router.navigate(['/tree']);
    // $('.tree-container').removeClass('invisible');
    // this.getQRCode();
  }

  // getQRCode() {
  //   console.log("qrcode call...");
  //   let url = 'http://receive-dev.azurewebsites.net/CoreService.svc/Code/Image/54d8f126-5bea-4c39-a17f-d0314981d05f';
  //   let options = {
  //     headers: new HttpHeaders({
  //       'Authorization': 'C837BC22-E7D5-4637-A361-F9EF218F5A71',
  //     }),
  //   };
  //
  //   /*return this.http.get<any>(url, options).subscribe(
  //     data => {
  //       console.log(data);
  //     },
  //     error => {
  //       console.log(error)
  //       // this.router.navigate(['/tree']);
  //     });*/
  //
  //   return this.http.get(url, {headers: options.headers, responseType: 'blob', observe: 'response'}).subscribe(
  //     data => {
  //       console.log(data);
  //       // // let qrCodeData = 'data:image/png;base64,' + new Buffer(data.body).toString('base64');
  //       this.urlCreator = data;
  //       // this.urlCreator.createObjectURL(data);
  //       this.router.navigate(['/tree']);
  //       console.log(this.urlCreator);
  //     },
  //     error => {
  //       console.log(error);
  //       // this.router.navigate(['/tree']);
  //     });
  //
  // }

  /*setCookie(cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  }

  getCookie(cname) {
    var name = cname + '=';
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  checkCookie() {
    var uuid = this.getCookie('UUID');
    if (uuid != '') {
      return uuid;
    } else {
      uuid = UUID.UUID();
      if (uuid != '' && uuid != null) {
        uuid = UUID.UUID();
        this.setCookie('UUID', uuid, 365);
        return uuid;
      }
    }
  }*/

}
