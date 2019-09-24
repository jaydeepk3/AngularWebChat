import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor() { }
  chatData: any;
  ngOnInit() {
    
  }

  changeChatData = (data) => {
    this.chatData = JSON.parse(data);
    // this.image = image;
  }

}
