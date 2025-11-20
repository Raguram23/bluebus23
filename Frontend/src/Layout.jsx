// Layout.jsx
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import PageNotFound from '../PageNotFound';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { AuthProvider } from './authcontext';

const Layout = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    // Fetch the role from local storage to check if the user is admin
    const role = localStorage.getItem('role');
    if (role === 'ADMIN') {
      setIsAdmin(true);
    }
  });
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
