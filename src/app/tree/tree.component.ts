import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UUID} from "angular2-uuid";
import {jsonpack} from 'jsonpack';
import * as $ from 'jquery';
import * as html2canvas from "html2canvas";

@Component({
    selector: 'app-tree',
    templateUrl: './tree.component.html',
    styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {

    @ViewChild('screen') screen: ElementRef;
    @ViewChild('canvas') canvas: ElementRef;
    @ViewChild('downloadLink') downloadLink: ElementRef;

    constructor(private http: HttpClient) {
    }

    baseURL = 'http://receive-dev.azurewebsites.net/LegacyService.svc';
    image = '';
    inputType = 'view';
    inputData = "ShareTree";

    ngOnInit() {
        this.image = '';
        let uuid = UUID.UUID();
        console.log('......when tree............', uuid)
        console.log(this.checkCookie('UUID', uuid));
        console.log(this.getCookie('UUID'));

        if (this.getCookie('qrId') !== '') {
            this.getQRCode();
        } else {
            this.getData();
        }
    }

    newTree() {
        this.deleteCookie('UUID');
        this.deleteCookie('qrId');
        this.deleteCookie('codeText');
        this.ngOnInit();
        // this.deleteCookie('UUID');
        // this.deleteCookie('qrId');
        //
        // let uuid = UUID.UUID();
        // console.log(this.checkCookie('UUID', uuid));
        // console.log(this.getCookie('UUID'));
        //
        // if (this.getCookie('qrId') !== '') {
        //     this.image = '';
        //     this.getQRCode();
        // } else {
        //     this.getData();
        // }
    }

    print() {
        setTimeout(this.print, 100);
        //window.print();
    }

    download() {
        html2canvas(this.screen.nativeElement).then(canvas => {
            this.canvas.nativeElement.src = canvas.toDataURL();
            this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
            this.downloadLink.nativeElement.download = 'download.png';
            this.downloadLink.nativeElement.click();
            this.canvas.nativeElement.src = '';
        });
    }

    // printDiv = () => {
    //     window.print();
    // }

    getData() {
        console.log('data call....');
        let url = this.baseURL + '/Code';
        let data = 'DeviceId=' + this.getCookie('UUID') + '&DeviceName=' + this.getDeviceType() + '&DeviceType=Web';

        let options = {
            headers: new HttpHeaders({
                'Authorization': 'C837BC22-E7D5-4637-A361-F9EF218F5A71',
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
        };
        return this.http.post<any>(url, data, options).subscribe(
            data => {
                console.log("...................data.....................", data);
                let qrId = data.Id;
                let userDeviceId = data.UserDeviceId;
                console.log(qrId);
                this.checkCookie('qrId', qrId);
                this.checkCookie('userDeviceId', userDeviceId);
                this.checkCookie('codeText', data['CodeText']);
                this.getQRCode();
            },
            error => {
                console.log(error);
                // this.router.navigate(['/tree']);
            });
    }

    getQRCode() {
        console.log("qrcode call...");
        let url = this.baseURL + '/Code/Image/' + this.getCookie('qrId');
        let options = {
            headers: new HttpHeaders({
                'Authorization': 'C837BC22-E7D5-4637-A361-F9EF218F5A71',
            }),
        };
        let base64StringData = localStorage.getItem("qrCode");
        if (base64StringData !== undefined && base64StringData !== '' && base64StringData !== null) {
            this.image = 'data:image/png;base64,' + base64StringData;
        } else {
            return this.http.get(url, {
                headers: options.headers,
                responseType: 'arraybuffer',
                observe: 'response'
            }).subscribe(
                (data) => {
                    console.log(data.body);
                    // var blob = new Blob([data], {type: "image/png"});
                    // this.image = window.URL.createObjectURL(data);
                    // let qrCodeData = 'data:image/png;base64,' + new Buffer(data.body).toString('base64');
                    let base64String = btoa(String.fromCharCode(...new Uint8Array(data.body)));
                    // this.image = 'data:image/png;base64,' + (data.body).toString();
                    this.image = 'data:image/png;base64,' + base64String;
                    localStorage.setItem("qrCode", base64String);
                    // this.checkCookie('qrCode', base64String);
                    // this.urlCreator = data;
                    // this.urlCreator.createObjectURL(data);
                    // console.log(this.image);
                    // console.log("qrCode...........",this.getCookie('qrCode'));
                    // const json = jsonpack.unpack(base64String);
                    // console.log(localStorage.getItem("qrCode"));
                },
                error => {
                    console.log(error);
                    // this.router.navigate(['/tree']);
                });
        }
        /*return this.http.get<any>(url, options).subscribe(
          data => {
            console.log(data);
          },
          error => {
            console.log(error)
            // this.router.navigate(['/tree']);
          });*/


    };

    editTitle = () => {
        this.inputType = "input";
        console.log(this.inputType);
        // this.inputType.nativeElement.focus();
        // $("#editTitleText").select();
        // $('#editTitleText').focus(function() { $(this).select(); } );
    };

    setCookie(cname, cvalue, exdays) {
        let d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = 'expires=' + d.toUTCString();
        document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
    };

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

    deleteCookie(cname) {
        document.cookie = cname + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    };

    checkCookie(cname, cvalue) {
        let value = this.getCookie(cname);
        if (value !== '') {
            return value;
        } else {
            // uuid = UUID.UUID();
            if (cvalue !== '' && cvalue !== null) {
                // uuid = UUID.UUID();
                this.setCookie(cname, cvalue, 365);
                return cvalue;
            }
        }
    }

    getDeviceType() {
        /*var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
            (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
                (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
                    (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;


        if (Sys.ie) return ('IE: ' + Sys.ie);
        if (Sys.firefox) return ('Firefox: ' + Sys.firefox);
        if (Sys.chrome) return ('Chrome: ' + Sys.chrome);
        if (Sys.opera) return ('Opera: ' + Sys.opera);
        if (Sys.safari) return ('Safari: ' + Sys.safari);*/
        return "web";
    }


}
