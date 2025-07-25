import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bikeshare.app',
  appName: 'BikeshareApp',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
