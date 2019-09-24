import {Component, OnInit, Injectable, Input, OnChanges, HostListener, AfterViewInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
// import { networkInterfaces } from 'os';
import {UtilityService} from "../../utility.service";

declare var $: any;

@Component({
    selector: 'app-chat-body',
    templateUrl: './chat-body.component.html',
    styleUrls: ['./chat-body.component.css']
})
@Injectable()
export class ChatBodyComponent implements OnChanges, AfterViewInit {
    @Input() chatNewData: any;

    constructor(private http: HttpClient, private util: UtilityService) {
    }

tempImgObj: any;

    jsonChatData: any;
    tempData: any;
    chatData: any;
    chatName: any;
    image: any;
    inputData = '';
    isChatEnable = false;
    class = 'replies';
    baseURL = 'http://receive-dev.azurewebsites.net/LegacyService.svc';
    url = this.baseURL + '/Message/Send';
    myId = this.util.getCookie('userDeviceId');
    isPreviewScreen = false;
    inputDataWithAttachment = '';
    imageObj: any;
    imageUrl: any;
    videoUrl: any;
    files: File[] = [];
    ngAfterViewInit() {
        setTimeout(() => {
            this.scrollToBottom();
        });
    }

    ngOnChanges() {
        this.tempData = localStorage.getItem(this.chatNewData.id);
        this.jsonChatData = JSON.parse(this.tempData);
        this.chatData = "";
        if (this.jsonChatData && this.jsonChatData.length > 0) {
            this.jsonChatData.forEach(element => {
                this.class = (element.SenderId == this.myId) ? 'replies' : 'sent';
                this.chatData += `<li class="` + this.class + `">`;
                if (element.Attachment != null) {
                    if (element.Attachment.ContentType == "image/jpg" || element.Attachment.ContentType == "image/png" || element.Attachment.ContentType == "image/jpeg") {
                        this.chatData += `<img src="http://emilcarlsson.se/assets/jonathansidwell.png" alt = "" /> 
          <img src="http://receive-dev.azurewebsites.net/LegacyService.svc/File/Stream/` + element.Attachment.Id + `" class="attachment">`;
                    } else {
                        this.chatData += '<video controls class="attachment"> <source src ="http://receive-dev.azurewebsites.net/LegacyService.svc/File/Stream/' + element.Attachment.Id + '" type = "video/mp4"> </video>';
                    }
                    this.chatData += `<p>` + element.MessageText + `</p></li>`;
                } else {
                    this.chatData += `<img src="http://emilcarlsson.se/assets/jonathansidwell.png" alt="" />
        <p>` + element.MessageText + `</p></li>`;
                }
            });
        }
        setTimeout(() => {
            this.scrollToBottom();
        });
        this.chatName = this.chatNewData && this.chatNewData.name ? this.chatNewData.name : 'Louis Litt';
        this.image = this.chatNewData && this.chatNewData.image ? this.chatNewData.image : 'http://emilcarlsson.se/assets/louislitt.png';
        this.isChatEnable = this.chatNewData.isChatEnable;
    }

    sendMessage() {
        this.chatData += '<li class="replies"><img src = "' + this.image + '" alt = "" /> <p>' + this.inputData + '</p> </li>';
        setTimeout(() => {
            this.scrollToBottom();
        });
        this.jsonChatData.push({
            Attachment: null,
            ConversationId: this.chatNewData.id,
            DeleteDate: null,
            Id: null,
            InsertDate: null,
            IsDeleted: null,
            MessageText: this.inputData,
            SenderId: this.util.getCookie('userDeviceId'),
            Status: 0,
            Type: 'text/plain',
            UpdateDate: null
        });
        localStorage.setItem(this.chatNewData.id, JSON.stringify(this.jsonChatData));
        let body = new FormData();
        body.append('ConversationId', this.chatNewData.id);
        body.append('SenderCode', this.util.getCookie('codeText'));
        body.append('Message', this.inputData);
        body.append('Type', 'text/plain');
        let options = {
            headers: new HttpHeaders({
                'Authorization': 'C837BC22-E7D5-4637-A361-F9EF218F5A71'
            })
        };
        this.http.post<any>(this.url, body, options).subscribe(
            data => {
                localStorage.setItem(this.chatNewData.id, JSON.stringify(data.Messages));
            },
            error => {
                console.log(error);
            });
        this.inputData = null;
        $('#composeText').val('');
    }

    scrollToBottom() {
        let height = $(document).height() + 10000;
        $('#chatScroll').animate({scrollTop: height}, 'slow');
    }

    previewImage(event) {
        this.isPreviewScreen = true;
        this.imageObj = event;
        this.tempImgObj = event.target.files;
        
        if (event.target.files && event.target.files[0]) {
            this.previewDroppedImage(event.target.files);

            var reader = new FileReader();

            reader.readAsDataURL(event.target.files[0]); // read file as data url

            reader.onload = (event) => { // called once readAsDataURL is completed
                if (event.target['files'] && event.target['files'][0].type == "video/mp4") {
                    this.videoUrl = event.target['result'];
                } else {
                    this.imageUrl = event.target['result'];
                }
            }
        }
    }
    
    onRemove(event) {
		console.log(event);
		this.files.splice(this.files.indexOf(event), 1);
	}
    previewDroppedImage(event) {
        this.isPreviewScreen = true;
        this.imageObj = event;
        console.log(event);
        let tempFile = event.addedFiles || event    ;
        this.files.push(...tempFile);
        console.log(tempFile);
        if (event && event[0]) {
            var reader = new FileReader();

            reader.readAsDataURL(event[0]); // read file as data url

            reader.onload = (event) => { // called once readAsDataURL is completed
                if (event.target['files'] && event.target['files'][0].type == "video/mp4") {
                    this.videoUrl = event.target['result'];
                } else {
                    this.imageUrl = event.target['result'];
                }
            }
        }
    }

    uploadImage() {
        event = this.imageObj;
        let images = event.target['files'][0];
        if (images) {
            if (images.type == "image/jpg" || images.type == "image/png" || images.type == "image/jpeg" || images.type == "video/mp4") {
                var reader = new FileReader();
                reader.readAsDataURL(images);
                this.isPreviewScreen = false;
                reader.onload = (url) => { // called once readAsDataURL is completed
                    if (images.type == "image/jpg" || images.type == "image/png" || images.type == "image/jpeg") {
                        this.chatData += '<li class="replies"><img src = "' + this.image + '" alt = "" /> <img src="' + url.target['result'] + '"  class="attachment"> </li>';
                    } else {
                        this.chatData += '<li class="replies"><img src = "' + this.image + '" alt = "" /> <video controls class="attachment"> <source src = ' + url.target['result'] + ' type = "video/mp4"> </video></li>';
                    }
                }
                this.scrollToBottom();
                let body = new FormData();
                body.append('ConversationId', this.chatNewData.id);
                body.append('SenderCode', this.util.getCookie('codeText'));
                body.append('Message', this.inputDataWithAttachment);
                body.append('Type', images.type);
                body.append('File', images);
                let options = {
                    headers: new HttpHeaders({
                        'Authorization': 'C837BC22-E7D5-4637-A361-F9EF218F5A71'
                    })
                };
                this.http.post<any>(this.url, body, options).subscribe(
                    data => {
                        localStorage.setItem(this.chatNewData.id, JSON.stringify(data.Messages));
                    },
                    error => {
                        console.log(error);
                    });
            } else {
                alert("Select valid file");
            }
        }
    }
}

/*

generateMediaUrl (file) {
        var fileReader = new FileReader();

        if (file.type.match('image')) {
            fileReader.onload = function () {
                var img = document.createElement('img');
                img.src = fileReader.result;
                document.getElementsByTagName('div')[
                    0
                    ].appendChild(img);
            };
            fileReader.readAsDataURL(file);
        } else {
            fileReader.onload = function () {
                var blob = newBlob([
                    fileReader.result
                ], {
                    type: file.type
                });
                var url = URL.createObjectURL(blob);
                var video = document.createElement('video');
                var timeupdate = function () {
                    if (snapImage()) {
                        video.removeEventListener('timeupdate',
                            timeupdate);
                        video.pause();
                    }
                };
                video.addEventListener('loadeddata',
                    function () {
                        if (snapImage()) {
                            video.removeEventListener('timeupdate',
                                timeupdate);
                        }
                    });
                var snapImage = function () {
                    var canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    canvas.getContext('2d').drawImage(video,
                        0,
                        0,
                        canvas.width,
                        canvas.height);
                    var image = canvas.toDataURL();
                    var success = image.length > 100000;
                    if (success) {
                        var img = document.createElement('img');
                        img.src = image;
                        document.getElementsByTagName('div')[
                            0
                            ].appendChild(img);
                        URL.revokeObjectURL(url);
                    }
                    return success;
                };
                video.addEventListener('timeupdate',
                    timeupdate);
                video.preload = 'metadata';
                video.src = url; //LoadvideoinSafari/IE11video.muted=true;video.playsInline=true;video.play();
            };
            fileReader.readAsArrayBuffer(file);
        }
    }

 */

// @HostListener('dragover', ['$event']) onDragOver(evt) {
//   debugger;
//   evt.preventDefault();
//   evt.stopPropagation();
//   let files = evt.dataTransfer.files;
//   if (files.length > 0) {
//     this.previewIm