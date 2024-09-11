import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import './styles/style.css';
import './styles/variables.css';
import { CartProvider } from './contexts/CartContext.tsx';
import App from './App.tsx';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <CartProvider>
        <App/>
      </CartProvider>
    </Provider>
  </React.StrictMode>
);
