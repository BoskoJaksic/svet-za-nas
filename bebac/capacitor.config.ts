import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bebac.app',
  appName: 'bebac',
  webDir: 'www',
  plugins:{
    "GoogleAuth":{
      scopes:['profile',"email"],
      clientId:'211967449887-kg2vpsiljrrthvfo22rkiifaklb1mb12.apps.googleusercontent.com',
      forceCodeForRefreshToken: true
    }
  },

  server: {
    androidScheme: 'https',
    hostname: "localhost",
    cleartext: true,
    url: "http://localhost:8100",
  }
};

export default config;
