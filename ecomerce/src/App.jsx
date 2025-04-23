import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./login";
import Dashboard from "./Dashboard";
import Products from "./Products";
import AddProduct from "./AddProduct" ;
import Shop from "./cleintSide";
import Cart from "./cart"; // ✅ استيراد صفحة العربة
import ClientOrders from "../ClientOrders";
import CategoryProducts from "./CategoryProducts";
import "bootstrap/dist/css/bootstrap.min.css";
import Profile from "./profile";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product" element={<AddProduct />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart  />} /> {/* ✅ إضافة صفحة العربة */}
        <Route path="/orders" element={<ClientOrders  />} /> 
        <Route path="/category/:category" element={<CategoryProducts />} />
        <Route path="/profile/:email" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
