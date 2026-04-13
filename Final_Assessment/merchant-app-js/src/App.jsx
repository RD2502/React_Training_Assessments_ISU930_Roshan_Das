import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { userManager } from './services/auth';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TransactionReport from './pages/TransactionReport';
import QRPage from './pages/QRPage';
import LanguageUpdate from './pages/LanguageUpdate';
import HelpSupport from './pages/HelpSupport';
import Callback from './pages/Callback';

const LoginRedirect = () => {
  useEffect(() => {
    userManager.signinRedirect().catch(console.error);
  }, []);
  
  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
       <div className="spinner" style={{ width: '48px', height: '48px', borderTopColor: '#1d4ed8' }}></div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <LoginRedirect />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginRedirect />} />
        <Route path="/callback" element={<Callback />} />
        
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="reports" element={<TransactionReport />} />
          <Route path="qr" element={<QRPage />} />
          <Route path="language" element={<LanguageUpdate />} />
          <Route path="support" element={<HelpSupport />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
