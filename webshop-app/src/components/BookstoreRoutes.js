import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import NotFoundPage from "../pages/NotFoundPage";
import CartPage from "../pages/CartPage";
import CartPageV2 from "../pages/CartPageV2";
import UsersPage from "../pages/UsersPage";
import StorePage from "../pages/StorePage";
import StorePageV2 from "../pages/StorePageV2";
import DetailsPage from "../pages/DetailsPage";
import ProfilePage from "../pages/ProfilePage";
import OrdersPage from "../pages/OrdersPage";
import ProtectedRoutes from "../pages/ProtectedRoutes";

function BookstoreRoutes() {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/cart-v2" element={<CartPageV2 />} />
      <Route element={<ProtectedRoutes />}>
        {" "}
        <Route path="/users" element={<UsersPage />} />
      </Route>
      <Route element={<ProtectedRoutes />}>
        {" "}
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route element={<ProtectedRoutes />}>
        {" "}
        <Route path="/orders" element={<OrdersPage />} />
      </Route>
      <Route path="/books" element={<StorePage />} />
      <Route path="/books-v2" element={<StorePageV2 />} />
      <Route path="/books/:id" element={<DetailsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default BookstoreRoutes;
