import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home'
import { Route,Routes } from 'react-router-dom'
import Registration from './pages/Registeration'
import Login from './pages/Login'
import Shop from './pages/Shop'
import AdminHome from './pages/AdminHome'
import AdminProducts from './pages/AdminProducts'
import AdminAddProduct from './pages/AdminAddProduct'
import AdminOrders from './pages/AdminOrders'
import AdminUsers from './pages/AdminUsers'
import AdminProductDetails from './pages/AdminProductDetails'
import CustomerHome from './pages/CustomerHome'
import CustProduct from './pages/CustProduct'
import ProductDetails from './pages/ProductDetails'
import ProductDetailscust from './pages/ProductDetailscust'
import CustCart from './pages/CustCart'
import CustOrder from './pages/CustOrder'
import ProductEdit from './pages/ProductEdit'
import Checkout from './pages/Checkout'
import OrderConfirmation from "./pages/OrderConfirmation";
import CategoryProducts from './pages/CategoryProducts'
import CustCategoryProducts from './pages/CustCategoryProducts'

function App() { 

  return (
    <>
     <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/category/:category" element={<CategoryProducts />} />
        <Route path="/cust/category/:category" element={<CustCategoryProducts />} />
        <Route path='register' element={<Registration/>}/>
        <Route path='login' element={<Login/>}/>
        <Route path='shop' element={<Shop/>}/>
        <Route path="/home/product/:id" element={<ProductDetailscust />} />
        <Route path='admin' element={<AdminHome/>}/>
        <Route path="/admin/products" element={<AdminProducts/>}/>
        <Route path="/admin/products/add" element={<AdminAddProduct/>} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path='/admin/user' element={<AdminUsers/>}/>
        <Route path='cust' element={<CustomerHome/>}/>
        <Route path='/admin/product/:id' element={<AdminProductDetails/>}/>
        <Route path='/cust/product' element={<CustProduct/>}/>
        <Route path="/cust/product/:id" element={<ProductDetails />} />
        <Route path="/cust/cart" element={<CustCart />} />
        <Route path="/checkout" element={<Checkout />} />  {/* ✅ Add Checkout Route */}
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/cust/orders" element={<CustOrder />} />
        <Route path="/admin/products/edit/:id" element={<ProductEdit />} />
     </Routes>
    </>
  )
}

export default App
