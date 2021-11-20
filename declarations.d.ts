declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'
      FIREBASE_KEY_USER: string
      DATABASE_URL: string
      GOOGLE_APPLICATION_CREDENTIALS: string
      NCP_ID: string
      NCP_KEY: string
      REDIS_HOSTNAME: string
      X_Naver_Client_Id: string
      X_Naver_Client_Secret: string
      INSTA_SESSION_ID: string
      JWT_SECRET: string
    }
  }
}

export { }
