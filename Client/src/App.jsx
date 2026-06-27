// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/user/Home';
import ProductDetail from './pages/user/ProductDetail';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import Orders from './pages/user/Orders';
import Profile from './pages/user/Profile';

import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AddProduct from './pages/admin/AddProduct';
import AdminOrders from './pages/admin/Orders';
import AdminCategories from './pages/admin/Categories';

import ProtectedRoute from './components/layout/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import { OrderDetail } from './pages/user/OrderDetails';
import EditProduct from './pages/admin/EditProduct';
import AdminUsers from './pages/admin/Users';

export default function App() {
  return (
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* public */}
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          {/* user */}
          <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute> } />
          <Route path='/products/:id' element={<ProtectedRoute><ProductDetail /></ProtectedRoute>   } />
          <Route path='/cart' element={<ProtectedRoute role='user'><Cart /></ProtectedRoute>} />
          <Route path='/checkout' element={<ProtectedRoute role='user'><Checkout /></ProtectedRoute>} />
          <Route path='/orders' element={<ProtectedRoute role='user'><Orders /></ProtectedRoute>} />
          <Route path='/profile' element={<ProtectedRoute role='user'><Profile /></ProtectedRoute>} />
          <Route path="/order/:id" element={<ProtectedRoute role='user'><OrderDetail /></ProtectedRoute>} />

          {/* admin */}
          <Route path='/admin' element={<ProtectedRoute role='admin'><AdminDashboard /></ProtectedRoute>} />
          <Route path='/admin/products' element={<ProtectedRoute role='admin'><AdminProducts /></ProtectedRoute>} />
          <Route path='/admin/products/add' element={<ProtectedRoute role='admin'><AddProduct /></ProtectedRoute>} />
          <Route path='/admin/orders' element={<ProtectedRoute role='admin'><AdminOrders /></ProtectedRoute>} />
          <Route path='/admin/product/edit/:id' element={<ProtectedRoute role='admin'><EditProduct /></ProtectedRoute>} />
          <Route path='/admin/categories' element={<ProtectedRoute role='admin'><AdminCategories /></ProtectedRoute>} />
          <Route path='/admin/users' element={<ProtectedRoute role='admin'><AdminUsers /></ProtectedRoute>} />
        

        </Routes>
      </BrowserRouter>
  );
}