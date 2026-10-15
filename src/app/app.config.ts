import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { routes } from './app.routes';

const firebaseConfig = {
  authDomain: "code-a-cuisine-a9b83.firebaseapp.com",
  projectId: "code-a-cuisine-a9b83",
  storageBucket: "code-a-cuisine-a9b83.firebasestorage.app",
  messagingSenderId: "729219939208",
  appId: "1:729219939208:web:7a57dafcd7703a2206583d"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)
  ]
};
