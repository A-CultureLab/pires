import * as admin from 'firebase-admin';
import { config } from 'dotenv';

config()

const userFirebase = admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_KEY_USER as string)),
}, 'user')



export const userAuth = userFirebase.auth()
export const userMessaging = userFirebase.messaging()