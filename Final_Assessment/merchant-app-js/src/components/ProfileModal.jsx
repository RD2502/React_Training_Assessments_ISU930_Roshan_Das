import React, { useState, useEffect } from 'react';

export default function ProfileModal({ isOpen, onClose }) {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('activeProfileDetails');
      if (saved) {
        try {
          setProfileData(JSON.parse(saved));
        } catch(e) {
          console.error("Profile parsing error");
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const basicInfo = [
    { label: 'Name', value: profileData?.merchant_name || profileData?.name || 'Unknown User' },
    { label: 'Phone', value: profileData?.merchant_mobile || 'N/A' },
    { label: 'Merchant Email', value: profileData?.merchant_email || 'N/A' }
  ];

  const deviceInfo = [
    { label: 'Device Serial Number', value: profileData?.serial_number || 'N/A' },
    { label: 'Linked Account Number', value: profileData?.merchant_account_no || 'N/A' },
    { label: 'UPI ID (VPA)', value: profileData?.vpa || 'N/A' },
    { label: 'IFSC Code', value: profileData?.ifsc || 'N/A' },
    { label: 'Merchant ID', value: profileData?.merchant_id || 'N/A' },
    { label: 'Network Type', value: profileData?.network_type || 'N/A' },
    { label: 'Device Status', value: profileData?.device_status || 'N/A' },
    { label: 'Terminal ID', value: profileData?.terminal_id || 'N/A' }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card, #ffffff)',
        width: '550px',
        maxHeight: '90vh',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '8px'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-color, #e2e8f0)',
          fontWeight: 600,
          fontSize: '1.05rem',
          color: 'var(--text-main, #1e293b)'
        }}>
          View Profile Details
        </div>

        {/* Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          
          {/* Basic Info Box */}
          <div style={{ border: '1px solid var(--border-color, #e2e8f0)', borderRadius: '6px', marginBottom: '24px' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-color, #e2e8f0)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main, #1e293b)' }}>
              Basic Information
            </div>
            <div style={{ padding: '16px' }}>
              {basicInfo.map((info, idx) => (
                <div key={idx} style={{ display: 'flex', marginBottom: idx === basicInfo.length - 1 ? 0 : '16px' }}>
                  <span style={{ width: '220px', color: 'var(--text-muted, #64748b)', fontSize: '0.9rem' }}>{info.label}</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-main, #1e293b)', fontWeight: 500 }}>{info.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Device Info Box */}
          <div style={{ border: '1px solid var(--border-color, #e2e8f0)', borderRadius: '6px' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-color, #e2e8f0)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main, #1e293b)' }}>
              Device Information
            </div>
            <div style={{ padding: '16px' }}>
              {deviceInfo.map((info, idx) => (
                <div key={idx} style={{ display: 'flex', marginBottom: idx === deviceInfo.length - 1 ? 0 : '16px' }}>
                  <span style={{ width: '220px', color: 'var(--text-muted, #64748b)', fontSize: '0.9rem' }}>{info.label}</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-main, #1e293b)', fontWeight: 500 }}>{info.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          justifyContent: 'flex-end',
          backgroundColor: 'var(--bg-main, #f9fafb)',
          borderRadius: '0 0 8px 8px'
        }}>
          <button 
            onClick={onClose}
            className="btn-primary" 
            style={{ padding: '10px 24px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 500 }}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
