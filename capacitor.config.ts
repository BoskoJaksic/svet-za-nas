import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bebac.app',
  appName: 'Svet za nas',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    // hostname: "localhost",
    // cleartext: true,
    // url: "http://localhost:8100",
  },
  plugins:{
    GoogleAuth:{
      scopes:['profile',"email"],
      iosClientId:'211967449887-kg2vpsiljrrthvfo22rkiifaklb1mb12.apps.googleusercontent.com',
      serverClientId:'211967449887-99mtov0ld9urj5hl0oksi2579k7u8jt5.apps.googleusercontent.com',
      forceCodeForRefreshToken: true
    }
  },
};

export default config;
