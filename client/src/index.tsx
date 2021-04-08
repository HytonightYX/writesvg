import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import injects from './store';
import { Provider } from 'mobx-react';

import { configure } from 'mobx';
import { BrowserRouter } from 'react-router-dom';

import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { queryClient } from './query-client';

configure({ enforceActions: 'observed' });

if (module && module.hot) {
  module.hot.accept();
}

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <Provider {...injects}>
      <BrowserRouter>
        <App />
        <ReactQueryDevtools />
      </BrowserRouter>
    </Provider>
  </QueryClientProvider>,
  document.getElementById('root'),
);
