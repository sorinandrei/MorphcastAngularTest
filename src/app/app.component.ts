import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

declare const CY:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private loader = CY.loader();

  public stopSDK;
  public startSDK;
  public terminateSDK;

  private ws; 
  private oppenedConnection = false;
  user: any;
  public meetingNumber;
  constructor(
    public httpClient: HttpClient, 
    @Inject(DOCUMENT) document,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      let meetingId = params['meetingId'];
      this.meetingNumber = meetingId
  });
  }

  ngOnInit() {
    console.log("init")
    this.loadMorphcast();
    this.connectToServerAndStartSendingDataGuest(this.meetingNumber, "Guest_" + this.getRandomID(),"Guest_" + this.getRandomID() +"@gmail.com")
  }

  private getRandomID(): string{
    return Math.random().toString(36).substr(2, 9);
  }

  private loadMorphcast() {
    this.loader.licenseKey("39d24a4191518dde3e4fbed5ec690d6fc6a22dd3507d");
    this.loader.addModule(CY.modules().FACE_DETECTOR.name, { maxInputFrameSize: 320, multiFace: true });
    this.loader.addModule(CY.modules().FACE_ATTENTION.name, { smoothness: 0.99 });
    this.loader.addModule(CY.modules().FACE_EMOTION.name, { smoothness: 0.99, enableBalancer: false });
    this.loader.addModule(CY.modules().FACE_AROUSAL_VALENCE.name, {smoothness: 0.8});
    this.loader.addModule(CY.modules().FACE_AGE.name);
    this.loader.powerSave(1);
    this.loader.maxInputFrameSize(320);
    this.loader.load().then(({ start, stop, terminate  }) => {
      this.startSDK = start;
      this.stopSDK = stop;
      this.terminateSDK = terminate;
    });
  }

  connectToServerAndStartSendingDataGuest(meetingNumber:string, name:string, email:string) {

      this.user = {};
      this.user.name = name;
      this.user.user_id = email;

      this.ws = new WebSocket('wss://guarded-garden-95047.herokuapp.com');
  
      this.ws.onopen = () => {
        console.log('WebSocket Client Connected');

        const data = {
          user_id: this.user.user_id,
          meetingNumber: meetingNumber
        }
        
        this.ws.send(JSON.stringify(data))
        this.oppenedConnection = true;
      };

      this.ws.onclose = () => {
        this.oppenedConnection = false;
      }
      
      this.ws.onmessage = function(message) {
        console.log(message)
        console.log(message.data)
        console.log(JSON.parse(message.data));
      };
  
      window.addEventListener(CY.modules().FACE_DETECTOR.eventName, (evt) => {
        console.log('Face detector result', evt.detail);
        const data = {
          user: this.user.name,
          eventType : evt.detail.type,
          eventValue : evt.detail.totalFaces
        }
        if(this.oppenedConnection){
          this.ws.send(JSON.stringify(data))
        }
        
      });
  
      window.addEventListener(CY.modules().FACE_AGE.eventName, (evt) => {
        console.log('Age result', evt.detail);

        let data:EventData = new EventData();
        data.user = this.user.name;
        data.eventType = evt.detail.type
        data.eventValue = evt.detail.output.numericAge;

        if(this.oppenedConnection){
          this.ws.send(JSON.stringify(data))
        }
      });
  
      window.addEventListener(CY.modules().FACE_EMOTION.eventName, (evt) => {
        console.log('Emotion result', evt.detail);
        let data:EventData = new EventData();
        data.user = this.user.name;
        data.eventType = evt.detail.type
        data.eventValue = evt.detail.output.dominantEmotion;

        if(this.oppenedConnection){
          this.ws.send(JSON.stringify(data))
        }
      });
  
      window.addEventListener(CY.modules().FACE_ATTENTION.eventName, (evt) => {
        console.log('Face attention result', evt.detail);

        let data:EventData = new EventData();
        data.user = this.user.name;
        data.eventType = evt.detail.type
        data.eventValue = evt.detail.output.attention;

        if(this.oppenedConnection){
          this.ws.send(JSON.stringify(data))
        }
      });

      window.addEventListener(CY.modules().FACE_AROUSAL_VALENCE.eventName, (evt) => {
        console.log('Face arousal valence result', evt.detail , evt.detail.output.arousalvalence.arousal > 0);
        if(evt.detail.output.arousalvalence.arousal > 0){
          let data:EventData = new EventData();
          data.user = this.user.name;
          data.eventType = "face_arousal"
          data.eventValue = evt.detail.output.arousalvalence.arousal;

          if(this.oppenedConnection){
            this.ws.send(JSON.stringify(data))
          }
        }

        if(evt.detail.output.arousalvalence.valence > 0){
          let data:EventData = new EventData();
          data.user = this.user.name;
          data.eventType = "face_valence"
          data.eventValue = evt.detail.output.arousalvalence.valence;

          if(this.oppenedConnection){
            this.ws.send(JSON.stringify(data))
          }
        }
      });

    }
}


class EventData {
  user: string;
  eventType: string;
  eventValue: any;
}