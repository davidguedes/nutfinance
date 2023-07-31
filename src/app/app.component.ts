import { Component, OnInit } from '@angular/core'
import { SelectedIndexChangedEventData } from '@nativescript/core/ui/tab-view';

import {firebase} from '@nativescript/firebase';

//import { firebase } from '@nativescript/firebase-core'
//import '@nativescript/firebase-auth';
//import '@nativescript/firebase-storage';

@Component({
  selector: 'ns-app',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  ngOnInit() {
    firebase.init({
      // Optionally pass in properties for database, authentication and cloud messaging,
      // see their respective docs.
      iOSEmulatorFlush: true,
      showNotifications: true,
      showNotificationsWhenInForeground: true,

      onPushTokenReceivedCallback: (token) => {
        console.log('[Firebase] onPushTokenReceivedCallback:', { token });
        alert(`Token ${token}`);
      },

      onMessageReceivedCallback: (message: firebase.Message) => {
        console.log('MESSAGE RECEIVED:', message);
        //console.log('[Firebase] onMessageReceivedCallback:', { message });
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
  }

  onSelectedIndexChanged(args: SelectedIndexChangedEventData): void {
    console.log(`Selected index has changed ( Old index: ${args.oldIndex} New index: ${args.newIndex} )`);
  }
}
