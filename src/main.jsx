import { Suspense } from 'react';
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import App from './app';
import { store, persistor } from './redux/store'

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Suspense>
          <App />
        </Suspense>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
