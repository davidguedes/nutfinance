import { Component, OnInit } from '@angular/core'
import { Color, isAndroid } from '@nativescript/core';
import { SelectedIndexChangedEventData } from '@nativescript/core/ui/tab-view';

import {firebase, messaging} from '@nativescript/firebase';
import { LocalNotifications } from '@nativescript/local-notifications';
import { TransacaoService } from './core/services/transacao.service';

//import { firebase } from '@nativescript/firebase-core'
//import '@nativescript/firebase-auth';
//import '@nativescript/firebase-storage';

@Component({
  selector: 'ns-app',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  constructor(private transacaoService: TransacaoService) {}

  ngOnInit() {
    firebase.init({
      // Optionally pass in properties for database, authentication and cloud messaging,
      // see their respective docs.
      iOSEmulatorFlush: true,
      showNotifications: true,
      showNotificationsWhenInForeground: true,

      onPushTokenReceivedCallback: (token) => {
        console.log('[Firebase] onPushTokenReceivedCallback:', { token });
        this.transacaoService.setToken(token);
        alert(`Token ${token}`);
      },

      onMessageReceivedCallback: (message: firebase.Message) => {
        console.log('MESSAGE RECEIVED:', message.title);
        console.log(JSON.stringify(message));
        console.log('[Firebase] onMessageReceivedCallback:', { message });
      }
    }).then(
      () => {
        console.log('[Firebase] Initialized');
        console.log("firebase.init done");
      },
      error => {
        console.log('[Firebase] Initialize', { error });
        console.log(`firebase.init error: ${error}`);
      }
    );

    firebase.addOnMessageReceivedCallback((message) => {
      if (isAndroid) {
        LocalNotifications.schedule([
          {
            title: message.title,
            body: message.body,
            color: new Color('red'),
		        badge: 1,
            thumbnail: false,
            forceShowWhenInForeground:  true,
            icon: 'res://heart',
          }
        ]).then(
        scheduledIds => {
          console.log('Notification id(s) scheduled: ' + JSON.stringify(scheduledIds))
        },
        error => {
          console.log('scheduling error: ' + error)
        });
      }
    })
  }

  onSelectedIndexChanged(args: SelectedIndexChangedEventData): void {
    console.log(`Selected index has changed ( Old index: ${args.oldIndex} New index: ${args.newIndex} )`);
  }
}
