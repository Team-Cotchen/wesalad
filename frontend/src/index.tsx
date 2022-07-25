import React from 'react';
import GlobalStyle from 'styles/GlobalStyle';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import Router from './Router';
import theme from 'styles/theme';
import { Provider } from 'react-redux';
import { store } from './redux/store';

const container = document.getElementById('root');
const root = createRoot(container as Element);

root.render(
  <>
    <GlobalStyle />
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router />
      </ThemeProvider>
    </Provider>
  </>,
);
