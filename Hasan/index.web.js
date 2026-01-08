import React from 'react';
import { AppRegistry } from 'react-native';
import App from './src/App';
import appJson from './app.json';
import { createRoot } from 'react-dom/client';

AppRegistry.registerComponent(appJson.name, () => App);

// Web için - React 18 createRoot API
if (typeof document !== 'undefined') {
  const container = document.getElementById('root');
  const root = createRoot(container);
  root.render(<App />);
}

