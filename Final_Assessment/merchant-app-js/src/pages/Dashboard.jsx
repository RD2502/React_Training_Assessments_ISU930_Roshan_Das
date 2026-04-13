import React, { useEffect, useState } from 'react';
import { ArrowRightLeft, Banknote } from 'lucide-react';
import { format } from 'date-fns';
import Modal from '../components/Modal';
import { ApiService } from '../services/api';

export default function Dashboard() {
  const [vpas, setVpas] = useState([]);
  const [selectedVpa, setSelectedVpa] = useState('');
  const [showVpaModal, setShowVpaModal] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    ApiService.fetchById().then(data => {
      setVpas(data);
      if (data.length > 0) {
        setSelectedVpa(data[0].vpa);
      }
    });
  }, []);

  const loadDashboardStats = async () => {
    try {
      const today = format(new Date(), 'dd/MM/yyyy');
      const data = await ApiService.report(today, today);
      if (Array.isArray(data)) {
        setTotalCount(data.length);
        const sum = data.reduce((acc, curr) => acc + Number(curr.amount || curr.total_amount || 0), 0);
        setTotalAmount(sum);
      }
    } catch (e) {
      console.error("Dashboard Stats Fetch Error:", e);
    }
  };

  const handleProceed = () => {
    const activeProfile = vpas.find(v => v.vpa === selectedVpa);
    if (activeProfile) {
       localStorage.setItem('activeProfileDetails', JSON.stringify(activeProfile));
       // Dispatch sync event for other isolated components that use state
       window.dispatchEvent(new Event('profileUpdated'));
       loadDashboardStats();
    }
    setShowVpaModal(false);
  };

  return (
    <div>
      <h1 style={{marginBottom: 24}}>Dashboard</h1>
      
      <div style={{display: 'flex', gap: 24, marginBottom: 32}}>
        <div className="stat-card">
          <div style={{ background: '#e0f2fe', color: '#3b82f6', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowRightLeft size={20} />
          </div>
          <span style={{ marginLeft: '8px', color: '#334155', fontWeight: '500' }}>Total No Of Transaction</span>
          <strong>{totalCount > 1000 ? (totalCount / 1000).toFixed(1) + 'K' : totalCount}</strong>
        </div>
        <div className="stat-card">
          <div style={{ background: '#e0f2fe', color: '#3b82f6', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Banknote size={20} />
          </div>
          <span style={{ marginLeft: '8px', color: '#334155', fontWeight: '500' }}>Total Amount</span>
          <strong>{totalAmount >= 10000000 ? (totalAmount / 10000000).toFixed(2) + ' cr' : totalAmount >= 100000 ? (totalAmount / 100000).toFixed(2) + ' L' : totalAmount.toLocaleString('en-IN')}</strong>
        </div>
      </div>
      
      {/* VPA Selection Modal */}
      <Modal 
        isOpen={showVpaModal} 
        title="Select a VPA to Proceed:"
        actions={
          <>
            <button className="btn-secondary" onClick={() => setShowVpaModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleProceed}>Proceed</button>
          </>
        }
      >
        <div className="radio-list">
          {vpas.map((vpa) => (
            <label key={vpa.id} className="radio-item">
              <input 
                type="radio" 
                name="vpa" 
                value={vpa.vpa} 
                checked={selectedVpa === vpa.vpa}
                onChange={(e) => setSelectedVpa(e.target.value)}
              />
              {vpa.vpa}
            </label>
          ))}
        </div>
      </Modal>

    </div>
  );
}
