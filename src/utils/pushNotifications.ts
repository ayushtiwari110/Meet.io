import firebase from 'firebase/app';
import 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const messaging = firebase.messaging();

export const initializeFCM = () => {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      messaging.getToken().then((currentToken) => {
        if (currentToken) {
          console.log('FCM Token:', currentToken);
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
      });
    } else {
      console.log('Unable to get permission to notify.');
    }
  });
};

export const sendPushNotification = (userId: string, title: string, body: string) => {
  const payload = {
    notification: {
      title,
      body,
    },
    to: `/topics/${userId}`,
  };

  fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `key=${process.env.NEXT_PUBLIC_FIREBASE_SERVER_KEY}`,
    },
    body: JSON.stringify(payload),
  }).then((response) => {
    if (response.ok) {
      console.log('Push notification sent successfully.');
    } else {
      console.log('Failed to send push notification.');
    }
  }).catch((error) => {
    console.log('Error sending push notification:', error);
  });
};
