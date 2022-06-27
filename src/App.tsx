import React, { useState, useEffect } from 'react';

import { RxProvider } from './app/db/RxProvider';

import Router from './features/navigation/Router';

import 'react-medium-image-zoom/dist/styles.css';
import './App.css';

function App() {
  return (
    <RxProvider>
      <Router />
    </RxProvider>
  );
}

export default App;
