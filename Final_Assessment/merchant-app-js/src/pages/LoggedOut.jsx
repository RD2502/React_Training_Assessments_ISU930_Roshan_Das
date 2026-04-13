import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoggedOut() {
  const navigate = useNavigate();

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#161616', // Dark background matching screenshot
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '56px 48px',
        maxWidth: '520px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
      }}>
        <h2 style={{
          color: '#000',
          fontSize: '28px',
          fontWeight: 500,
          margin: '0 0 40px 0',
          lineHeight: '1.4'
        }}>
          You are logged out of<br/>Central Bank Of India.
        </h2>
        
        <button 
          onClick={() => navigate('/login')}
          style={{
            background: 'transparent',
            color: '#1d4ed8', // classic blue matching the text
            border: '1px solid #1d4ed8',
            borderRadius: '6px',
            padding: '12px 24px',
            fontSize: '15px',
            fontWeight: 400,
            cursor: 'pointer',
            width: '100%',
            transition: 'background 0.2s ease',
            outline: 'none'
          }}
          onMouseOver={(e) => e.target.style.background = '#f0f4f8'}
          onMouseOut={(e) => e.target.style.background = 'transparent'}
        >
          Log back into merchant-web-application
        </button>
      </div>
    </div>
  );
}
