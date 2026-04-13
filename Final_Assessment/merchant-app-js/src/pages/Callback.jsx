import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { userManager } from '../services/auth';

export default function Callback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    userManager.signinRedirectCallback()
      .then(user => {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('access_token', user.access_token);
        
        // Cache mobile assignment so we don't drop it on session refresh
        const mobile = user?.profile?.preferred_username || user?.profile?.phone_number || user?.profile?.name || '';
        localStorage.setItem('mobileNumber', mobile);
        
        navigate('/');
      })
      .catch(err => {
        console.error("Error handling authentication callback:", err);
        setError(`Failed to authenticate: ${err.message || "Please try again."}`);
      });
  }, [navigate]);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      {!error ? (
        <>
          <div className="spinner spinner-blue" style={{ width: '48px', height: '48px', marginBottom: '24px' }}></div>
          <h2 style={{ color: '#1e293b', fontWeight: 600 }}>Authenticating...</h2>
          <p style={{ color: '#64748b' }}>Please wait while we secure your session credentials.</p>
        </>
      ) : (
        <>
          <h2 style={{ color: '#ef4444', fontWeight: 600 }}>Authentication Failed</h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>{error}</p>
          <button className="btn-primary" onClick={() => navigate('/login')}>Return to Login</button>
        </>
      )}
    </div>
  );
}
