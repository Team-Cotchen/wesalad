import React from 'react';
import GlobalStyle from 'styles/GlobalStyle';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import Router from './Router';
import theme from 'styles/theme';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

const container = document.getElementById('root');
const root = createRoot(container as Element);
const persistor = persistStore(store);

root.render(
  <>
    <GlobalStyle />
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <Router />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </>,
);
