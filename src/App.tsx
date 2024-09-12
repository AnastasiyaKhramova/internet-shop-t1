import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './HOC/ProtectedRouter';
import Home from './pages/Home';
import Login from './pages/Login';
import ErrorPage from './pages/ErrorPage';
import Product from './pages/Product';
import Cart from './pages/Cart';

const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute element={<Home />} />,
    },
    {
      path: "*",
      element: <ErrorPage errorCode={404} />,
    },
    {
      path: "/product/:id",
      element: <ProtectedRoute element={<Product />} />,
    },
    {
      path: "/cart",
      element: <ProtectedRoute element={<Cart />} />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;