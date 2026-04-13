import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeOff, Eye } from 'lucide-react';
import { userManager } from '../services/auth';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Trigger standard active Session Redirect protocol (Authorization Code Flow)
    userManager.signinRedirect().catch((err) => {
      console.error("SSO Redirect Error:", err);
      setIsLoading(false);
    });
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8fafc',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Blurs */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '-10%',
        width: '600px',
        height: '600px',
        background: 'linear-gradient(135deg, rgba(59,130,246,0.3) 0%, rgba(236,72,153,0.3) 100%)',
        filter: 'blur(100px)',
        borderRadius: '50%',
        transform: 'translateY(-50%)',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '-5%',
        width: '400px',
        height: '400px',
        background: 'rgba(59,130,246,0.2)',
        filter: 'blur(80px)',
        borderRadius: '50%',
        zIndex: 0
      }} />

      {/* Login Card */}
      <div style={{
        background: 'white',
        padding: '48px 40px',
        borderRadius: '8px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
        width: '100%',
        maxWidth: '480px',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn-n76CfCuDK7VpBhTPe8Y1PKclWd-9zm7LA&s"
          alt="Central Bank of India"
          style={{ width: '220px', marginBottom: '40px' }}
        />

        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: '32px' }}>
          Login to your Account
        </h2>

        <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {errorMsg && (
            <div style={{ background: '#fef2f2', border: '1px solid #f87171', color: '#ef4444', padding: '12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500 }}>
              {errorMsg}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px', fontWeight: 500 }}>
              Username / Mobile Number
            </label>
            <input
              type="text"
              placeholder="Enter your Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                color: '#334155',
                fontSize: '0.95rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px', fontWeight: 500 }}>
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                paddingRight: '40px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                color: '#334155',
                fontSize: '0.95rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                bottom: '12px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8',
                padding: 0,
                display: 'flex'
              }}
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              background: '#1565c0',
              color: 'white',
              border: 'none',
              padding: '14px',
              borderRadius: '6px',
              fontWeight: 500,
              fontSize: '0.95rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: '8px',
              boxShadow: '0 4px 6px -1px rgba(21, 101, 192, 0.2)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '46px',
              opacity: isLoading ? 0.9 : 1
            }}
          >
            {isLoading ? <div className="spinner"></div> : 'Login'}
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#334155', cursor: 'pointer', fontWeight: 500 }}>
              <input type="checkbox" style={{ cursor: 'pointer', margin: 0, width: '14px', height: '14px', accentColor: '#1d4ed8' }} />
              Remember Me
            </label>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: '0.85rem', color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }}>
              Forgot Password?
            </a>
          </div>
        </form>
      </div>

      {/* Footer Links */}
      <div style={{
        position: 'absolute',
        bottom: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '32px',
        fontSize: '0.75rem',
        color: '#94a3b8',
        fontWeight: 500
      }}>
        <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'inherit', textDecoration: 'underline' }}>Terms and Conditions</a>
        <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'inherit', textDecoration: 'underline' }}>Privacy Policy</a>
        <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'inherit', textDecoration: 'none' }}>CA Privacy Notice</a>
      </div>
    </div>
  );
}
