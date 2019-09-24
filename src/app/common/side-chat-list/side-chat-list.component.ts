import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {UtilityService} from "../../utility.service";
@Component({
  selector: 'app-side-chat-list',
  templateUrl: './side-chat-list.component.html',
  styleUrls: ['./side-chat-list.component.css']
})
export class SideChatListComponent implements OnInit {

  constructor(private http: HttpClient, private util: UtilityService) { }
  baseURL = 'http://receive-dev.azurewebsites.net/LegacyService.svc';
  chatList: any;
  isLoading = true;
  lastMessage: any;
  chatData = {
    id: 0,
    name: 'Louis Litt',
    image: 'http://emilcarlsson.se/assets/louislitt.png',
    isChatEnable: false
  };
  ngOnInit() {
    let url = this.baseURL + '/Conversation';
    let userDeviceId=this.util.getCookie('userDeviceId');
    let data = 'UserDeviceId='+userDeviceId;
    console.log(".............................",userDeviceId);
    // let data = 'UserDeviceId=3293988f-244b-44aa-813c-d5aa35b49c53';
    let options = {
      headers: new HttpHeaders({
        'Authorization': 'C837BC22-E7D5-4637-A361-F9EF218F5A71',
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
    };
    return this.http.post<any>(url, data, options).subscribe(
      data => {
        console.log(data);
        data.forEach(element => {
          localStorage.setItem(element.Id, JSON.stringify(element.Messages));
        });
        this.chatList = data;
        this.isLoading = false;
        this.lastMessage = data[0].Messages[data[0].Messages.length - 1].MessageText
      },
      error => {
        console.log(error);
        // this.router.navigate(['/tree']);
      });
  }

  @Output()
  changeChatClick: EventEmitter<String> = new EventEmitter<String>();
  changeChat = (id, name) => {
    this.chatData.id = id;
    this.chatData.name = name;
    this.chatData.isChatEnable = true;
    this.changeChatClick.emit(JSON.stringify(this.chatData));
  }
}
