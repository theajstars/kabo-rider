import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ToastProvider } from "react-toast-notifications";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import DashboardContainer from "./Pages/DashboardContainer";
import Profile from "./Pages/Profile";
import Wallet from "./Pages/Wallet";
import ResetPassword from "./Pages/ResetPassword";
import Error404 from "./Pages/Error404";
import Notifications from "./Pages/Notifications";
import Verification from "./Pages/Verification";
import MyOrders from "./Pages/MyOrders";

function App() {
  return (
    <ToastProvider autoDismiss={true}>
      <Router>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/dashboard" element={<DashboardContainer />}>
            <Route index element={<Dashboard />} />

            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/dashboard/wallet" element={<Wallet />} />
            <Route path="/dashboard/verification" element={<Verification />} />
            <Route path="/dashboard/orders" element={<MyOrders />} />
            <Route
              path="/dashboard/notifications"
              element={<Notifications />}
            />
          </Route>
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
