import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; 
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import Product from './pages/Product.tsx';
import Cart from './pages/Cart.tsx';
import { store } from './store/store.ts'; 
import './styles/style.css';
import './styles/variables.css';
import Login from './pages/Login.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
  {
    path: "/product/:id",
    element: <Product />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}> 
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
