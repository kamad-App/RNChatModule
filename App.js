import React from 'react';
import {PersistGate} from 'redux-persist/integration/react';

import {Provider} from 'react-redux';
// Custom Imports
import Router from './Router';
 import {persistor, store} from './redux/store/index';

export default function App() {
  return ( 
     <Provider store={store}>
       <PersistGate persistor={persistor}>
        <Router /> 
     </PersistGate>
    </Provider>
 );
} 