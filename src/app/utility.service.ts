import {Injectable} from "@angular/core";

@Injectable()
export class UtilityService {


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

    setCookie(cname, cvalue, exdays) {
        let d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = 'expires=' + d.toUTCString();
        document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
    }

    deleteCookie(cname) {
        document.cookie = cname + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

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
}
