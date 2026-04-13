import React, { useState } from 'react';
import QRCodeModule from 'react-qr-code';
const QRCode = typeof QRCodeModule === 'object' && QRCodeModule.default ? QRCodeModule.default : QRCodeModule;
import Modal from '../components/Modal';
import { ApiService } from '../services/api';
import { CheckCircle } from 'lucide-react';

export default function QRPage() {
  const [type, setType] = useState('Static');
  const [amount, setAmount] = useState('');
  const [qrValue, setQrValue] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [staticQrData, setStaticQrData] = useState(null);

  const handleSubmit = async () => {
    setIsSubmitted(true);
    if (type === 'Dynamic') {
      if (!amount) return alert('Enter amount');
      const savedProfile = localStorage.getItem('activeProfileDetails');
      if (savedProfile) {
        try {
          const p = JSON.parse(savedProfile);
          
          // Bypass remote API and generate a dynamic equivalent locally
          let dynamicStr = p.qr_string || '';
          if (dynamicStr) {
            // Append amount to make the UPI string dynamic
            dynamicStr += `&am=${amount}`;
          }
          
          const b64 = await ApiService.convertToQRBase64(dynamicStr);
          if (b64) {
            setQrValue(b64);
          } else {
            console.error("Failed to compile local Dynamic QR");
          }
        } catch (err) {
          console.error("Dynamic QR execution failed:", err);
        }
      }
      setShowSuccessModal(false);
    } else if (type === 'Static') {
      const savedProfile = localStorage.getItem('activeProfileDetails');
      if (savedProfile) {
        const p = JSON.parse(savedProfile);
        const b64 = await ApiService.convertToQRBase64(p.qr_string);
        setStaticQrData({
          base64: b64,
          merchantName: p.merchant_name || 'CBOI MERCHANT',
          vpa: p.vpa_id || p.vpa || 'unknown@cbin'
        });
      }
    }
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setIsSubmitted(false);
    setQrValue(null);
  };

  const handleDownloadQR = () => {
    if (!staticQrData?.base64) return;
    const imgSrc = staticQrData.base64.startsWith('data:image')
      ? staticQrData.base64
      : `data:image/png;base64,${staticQrData.base64}`;

    // Natively bind DOM save trigger
    const link = document.createElement('a');
    link.href = imgSrc;
    link.download = `CBOI_Standee_${(staticQrData.merchantName || 'Merchant').replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>QR Details</h1>

      {/* Top Selection Card */}
      <div style={{
        background: 'white',
        padding: '24px 32px',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.95rem', fontWeight: 500 }}>Select The Type of QR</div>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500 }}>
              <input type="radio" checked={type === 'Static'} onChange={() => handleTypeChange('Static')} />
              Static
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500 }}>
              <input type="radio" checked={type === 'Dynamic'} onChange={() => handleTypeChange('Dynamic')} />
              Dynamic
            </label>

            {type === 'Dynamic' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto', marginRight: '32px' }}>
                <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Amount:</span>
                <input
                  type="number"
                  className="input-field"
                  style={{ marginBottom: 0, width: '150px', padding: '8px' }}
                  placeholder="Ex. 5000"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
        <button className="btn-primary" onClick={handleSubmit}>Submit</button>
      </div>

      {/* Bottom Content Area */}
      {isSubmitted && type === 'Static' && (
        <div style={{
          background: 'white',
          padding: '32px',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: 24, color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 500 }}>Select The Type of QR</div>

          {/* Virtual Standee */}
          {/* Virtual Standee (Pre-Generated Image from API) */}
          <div style={{
            width: '380px',
            margin: '0 auto',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            borderRadius: '8px',
            overflow: 'hidden',
            background: 'white',
            textAlign: 'center'
          }}>
            {staticQrData?.base64 ? (
              <img
                src={staticQrData.base64.startsWith('data:image') ? staticQrData.base64 : `data:image/png;base64,${staticQrData.base64}`}
                alt="Merchant Official QR Standee"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            ) : (
              <div style={{ width: '100%', height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                Rendering Official Standee...
              </div>
            )}
          </div>

          <button className="btn-primary" style={{ marginTop: 32 }} onClick={handleDownloadQR}>Download QR</button>
        </div>
      )}

      {isSubmitted && type === 'Dynamic' && qrValue && (
        <div style={{
          background: 'white',
          padding: '48px',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <h3 style={{ marginBottom: 24, fontSize: '1.5rem', color: 'var(--text-main)' }}>Dynamic QR Generated</h3>
          <div style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.15)', background: '#fff', display: 'inline-block', borderRadius: '8px', overflow: 'hidden' }}>
            {qrValue ? (
              <img
                src={qrValue.startsWith('data:image') ? qrValue : `data:image/png;base64,${qrValue}`}
                alt="Dynamic Amount QR"
                style={{ width: '380px', height: 'auto', display: 'block' }}
              />
            ) : (
              <div style={{ width: 380, height: 450, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>Rendering Dynamic QR...</div>
            )}
          </div>
          <div style={{ marginTop: 24, fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>Amount to collect: ₹{amount}</div>

          <button className="btn-primary" style={{ marginTop: 32 }} onClick={() => setShowSuccessModal(true)}>Confirm Collection</button>
        </div>
      )}

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      >
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div style={{ marginBottom: 16 }}>
            <CheckCircle color="#22c55e" size={80} style={{ background: '#dcfce7', borderRadius: '50%', padding: 12, margin: '0 auto' }} />
          </div>
          <h2 style={{ color: 'var(--text-main)', marginBottom: 8 }}>Payment Successful!</h2>
          <button className="btn-primary" style={{ marginTop: 24, width: '100%' }} onClick={() => setShowSuccessModal(false)}>
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}
