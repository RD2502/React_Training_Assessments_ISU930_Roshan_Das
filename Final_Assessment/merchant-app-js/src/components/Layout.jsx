import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, QrCode, Languages, HelpCircle, Menu } from 'lucide-react';
import ProfileModal from './ProfileModal';
import { userManager } from '../services/auth';

export default function Layout() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileName, setProfileName] = useState('Stebin Ben');
  const navigate = useNavigate();

  const updateProfileName = () => {
    const saved = localStorage.getItem('activeProfileDetails');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data && data.merchant_name) setProfileName(data.merchant_name);
      } catch (e) {
        // Suppress parsing blanks silently
      }
    }
  };

  useEffect(() => {
    updateProfileName(); // Boot trigger
    window.addEventListener('profileUpdated', updateProfileName);
    return () => window.removeEventListener('profileUpdated', updateProfileName);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    userManager.signoutRedirect().catch((err) => {
        console.error(err);
        navigate('/login');
    });
  };
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/reports', label: 'Transaction Reports', icon: <FileText size={20} /> },
    { path: '/qr', label: 'QR Details', icon: <QrCode size={20} /> },
    { path: '/language', label: 'Language Update', icon: <Languages size={20} /> },
    { path: '/support', label: 'Help & Support', icon: <HelpCircle size={20} /> },
  ];

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="logo-area">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn-n76CfCuDK7VpBhTPe8Y1PKclWd-9zm7LA&s"
            alt="CBOI"
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
          />
        </div>
        <nav className="nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <Menu size={24} style={{ color: 'var(--text-muted)' }} />
          <div className="user-profile-container" style={{ position: 'relative' }}>
            <div className="user-profile" onClick={() => setIsProfileOpen(!isProfileOpen)} style={{ cursor: 'pointer' }}>
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profileName)}&background=random`} alt={profileName} />
              <span>{profileName}</span>
            </div>
            {isProfileOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-item" onClick={() => { setIsProfileModalOpen(true); setIsProfileOpen(false); }}>View Profile</div>
                <div className="dropdown-item logout" onClick={handleLogout}>Logout</div>
              </div>
            )}
          </div>
        </header>

        <section className="content-area">
          <Outlet />
        </section>
      </main>

      {/* Profile Details Modal */}
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </div>
  );
}
