import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { ApiService } from '../services/api';
import { CheckCircle } from 'lucide-react';

export default function LanguageUpdate() {
  const [languages, setLanguages] = useState([]);
  const [selectedLang, setSelectedLang] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Profile details state
  const [vpaId, setVpaId] = useState('');
  const [serialNo, setSerialNo] = useState('');
  const [currentLang, setCurrentLang] = useState('');

  useEffect(() => {
    ApiService.fetchAllLanguage().then(setLanguages);
    
    // Fetch profile details
    const savedProfile = localStorage.getItem('activeProfileDetails');
    if (savedProfile) {
      try {
        const p = JSON.parse(savedProfile);
        setVpaId(p.vpa_id || p.vpa || '');
        setSerialNo(p.serial_number || p.device_serial_number || '');

        const tid = p.terminal_id || '';
        if (tid) {
          fetch(`https://api-preprod.txninfra.com/CBOI/isu_soundbox/user_api/current_language/${tid}`, {
            headers: {
              'pass_key': 'c0CKRG7yNFY3OIxY92izqj0YeMk6JPqdOlGgqsv3mhicXmAv',
              'Authorization': localStorage.getItem('access_token') || '',
              'User-Agent': 'PostmanRuntime/7.39.0',
              'Access-Control-Allow-Origin': '*'
            }
          })
            .then(async res => {
              if (!res.ok) {
                throw new Error(`API returned status: ${res.status}`);
              }
              const text = await res.text();
              return text ? JSON.parse(text) : {};
            })
            .then(json => {
              // Extract language based on standard structures
              const langCode = json.language || json.data?.language || json.current_language || 'Odia';
              setCurrentLang(langCode);
              
              // Set the selected language in dropdown initially
              const initialLang = json.language ? json.language.toLowerCase() : 'od';
              setSelectedLang(initialLang);
            })
            .catch(err => {
              console.warn("API 404 Expected. Falling back to default language:", err.message);
              setCurrentLang('Odia');
              setSelectedLang('od');
            });
        }
      } catch(e) {
        console.warn("Failed to parse profile details");
      }
    } else {
      // Fallback
      ApiService.currentLanguage().then(lang => {
        setSelectedLang(lang.code);
        setCurrentLang(lang.name);
      });
    }
  }, []);

  const handleUpdate = async () => {
    await ApiService.UpdateLanguage(selectedLang);
    setShowModal(true);
  };

  return (
    <div>
      <h1 style={{marginBottom: 24}}>Language Update</h1>
      
      <div style={{background: 'white', padding: 32, borderRadius: 'var(--radius)', border: '1px solid var(--border-color)'}}>
        <div style={{display: 'flex', gap: 24}}>
          <div style={{flex: 1}}>
             <label className="input-label">VPA ID</label>
             <input type="text" className="input-field" value={vpaId} readOnly disabled />
          </div>
          <div style={{flex: 1}}>
             <label className="input-label">Device Serial Number</label>
             <input type="text" className="input-field" value={serialNo} readOnly disabled />
          </div>
        </div>
        
        <div style={{display: 'flex', gap: 24}}>
          <div style={{flex: 1}}>
             <label className="input-label">Current Language</label>
             <input type="text" className="input-field" value={currentLang || 'Odia'} readOnly disabled />
          </div>
          <div style={{flex: 1}}>
             <label className="input-label">Language Update</label>
             <select className="input-field" value={selectedLang} onChange={e => setSelectedLang(e.target.value)}>
               {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
             </select>
          </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'flex-end', gap: 16, marginTop: 16}}>
           <button className="btn-secondary">Cancel</button>
           <button className="btn-primary" onClick={handleUpdate}>Update</button>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div style={{textAlign: 'center', padding: '16px 0'}}>
          <h2 style={{color: 'var(--text-main)', marginBottom: 24, fontSize: '1.2rem'}}>Language update request<br/>Initiated Successfully</h2>
          <div style={{marginBottom: 32}}>
            <CheckCircle color="#22c55e" size={80} style={{border: '4px solid #dcfce7', borderRadius: '50%', padding: 8}} />
          </div>
          <button className="btn-primary" style={{width: '100%'}} onClick={() => setShowModal(false)}>
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}
