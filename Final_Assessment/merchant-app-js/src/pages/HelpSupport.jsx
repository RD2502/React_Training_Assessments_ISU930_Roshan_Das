import React, { useState, useRef, useEffect } from 'react';
import Modal from '../components/Modal';
import { Paperclip, Search, ChevronsUpDown, ChevronLeft, ChevronRight, ArrowUp, Send, Flag } from 'lucide-react';

export default function HelpSupport() {
  const [showRaiseTicket, setShowRaiseTicket] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Filter State
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('Select Ticket Status');
  const [appliedFilters, setAppliedFilters] = useState({ start: '', end: '', status: 'Select Ticket Status' });

  // Form State
  const [reason, setReason] = useState('');
  const [txId, setTxId] = useState('');
  const [description, setDescription] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const fileInputRef = useRef(null);

  const initialTickets = Array.from({length: 55}).map((_, i) => ({
    txId: `12387191632${90 + i}`,
    transactionId: `2163876398127392${i + 1}`,
    raisedOn: '15/01/2026, 11:23:32 AM',
    date: '2026-01-15',
    number: `+91 9349${872421 + (i % 10)}`,
    operation: i % 3 === 0 ? 'Transaction Declined' : i % 3 === 1 ? 'Failed but deducted' : 'Refund not received',
    status: i % 4 === 0 ? 'Pending' : i % 2 === 0 ? 'Resolved' : 'Unresolved',
    description: i % 2 === 0 
      ? 'The user is requesting a review of their recent transaction decline, citing that their account balance was sufficient.'
      : 'Payment was deducted from the bank account but the status still shows as pending on the dashboard. Requesting a quick resolution.'
  }));

  const [tickets, setTickets] = useState(initialTickets);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [goToPageInput, setGoToPageInput] = useState('1');

  const initialMessages = [
    {
      id: 1,
      sender: 'Program Manager',
      initials: 'PM',
      time: '01 Mar, 2024 02.42 PM',
      text: 'Hello Support Team, I hope this message finds you well. I recently found out that my account, GamingMaster123, has been banned and I believe this might be a mistake. Could you please provide me with the details of the ban and guide me on how I can appeal this decision? Thanks.',
      isMe: false
    },
    {
      id: 2,
      sender: 'Support Team',
      initials: 'ST',
      time: '02 Mar, 2024 10.12 AM',
      text: 'Hi Shubham, thank you for reaching out. We understand your concern regarding the ban. After reviewing your account, we found that it was banned due to violations of our community guidelines, specifically regarding the use of third-party software to alter game dynamics. Please let us know if you have any information that might help us reassess your case.',
      isMe: false
    }
  ];

  const [ticketMessages, setTicketMessages] = useState(initialMessages);
  const [newMessageText, setNewMessageText] = useState('');

  useEffect(() => {
    if (selectedTicket) {
      setTicketMessages(initialMessages);
      setNewMessageText('');
    }
  }, [selectedTicket]);

  const handleSendMessage = () => {
    if (!newMessageText.trim()) return;
    const now = new Date();
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = String(now.getDate()).padStart(2, '0');
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    const strHours = String(hours).padStart(2, '0');
    
    const timeString = `${day} ${month}, ${year} ${strHours}.${minutes} ${ampm}`;

    const newMsg = {
      id: Date.now(),
      sender: 'Stebin Ben',
      initials: 'SB',
      time: timeString,
      text: newMessageText,
      isMe: true
    };
    setTicketMessages([...ticketMessages, newMsg]);
    setNewMessageText('');
  };

  const handleFilterSubmit = () => {
    setAppliedFilters({ start: filterStartDate, end: filterEndDate, status: filterStatus });
    setCurrentPage(1);
    setGoToPageInput('1');
  };

  const displayedTickets = tickets.filter(t => {
    let matchStart = true;
    let matchEnd = true;
    let matchStatus = true;

    if (appliedFilters.start && t.date) {
       matchStart = new Date(t.date) >= new Date(appliedFilters.start);
    }
    if (appliedFilters.end && t.date) {
       matchEnd = new Date(t.date) <= new Date(appliedFilters.end);
    }
    if (appliedFilters.status && appliedFilters.status !== 'Select Ticket Status') {
       matchStatus = t.status === appliedFilters.status;
    }
    return matchStart && matchEnd && matchStatus;
  });

  const totalTickets = displayedTickets.length;
  const totalPages = Math.ceil(totalTickets / rowsPerPage);
  
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedTickets = displayedTickets.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPageInput(page.toString());
    }
  };

  const handleGoToChange = (e) => {
    const val = e.target.value;
    setGoToPageInput(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPages) {
      setCurrentPage(parsed);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachmentName(e.target.files[0].name);
    }
  };

  const handleTicketSubmit = () => {
    if (!reason || !txId) {
      alert('Please fill out the Reason and Transaction ID');
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString('en-US');
    const generatedTicketId = Date.now().toString();
    const newTicket = { txId: generatedTicketId, transactionId: txId, description, operation: reason, number: '+91 0000000000', status: 'Pending', date: today, raisedOn: `${today}, ${timeStr}` };
    setTickets([newTicket, ...tickets]);
    
    // Reset & Close
    setReason('');
    setTxId('');
    setDescription('');
    setAttachmentName('');
    setShowRaiseTicket(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return { bg: '#ffedd5', text: '#ea580c' };
      case 'Unresolved': return { bg: '#ffe4e6', text: '#e11d48' };
      case 'Resolved': return { bg: '#ecfdf5', text: '#22c55e' };
      default: return { bg: '#e2e8f0', text: '#334155' };
    }
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24}}>
        <h1 style={{marginBottom: 0, cursor: 'pointer'}} onClick={() => setSelectedTicket(null)}>Help & Support</h1>
        <button className="btn-primary" onClick={() => setShowRaiseTicket(true)}>Raise a ticket</button>
      </div>

      {selectedTicket ? (
        <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
          {/* Top Panel - Ticket Details */}
          <div style={{background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #f1f5f9'}}>
              <h3 style={{fontSize: '1rem', fontWeight: 600, color: '#1e293b'}}>Ticket ID: #{selectedTicket.txId}</h3>
              <button 
                style={{background: '#e2e8f0', color: '#475569', border: 'none', padding: '6px 16px', borderRadius: 4, fontWeight: 500, cursor: 'pointer', fontSize: '0.85rem'}}
                onClick={() => setShowCloseConfirm(true)}
              >
                Close Ticket
              </button>
            </div>
            <div style={{padding: 24, display: 'flex'}}>
              <div style={{flex: 1}}>
                <p style={{color: '#94a3b8', fontSize: '0.9rem', marginBottom: 4}}>Reason Type</p>
                <p style={{color: '#334155', fontWeight: 500, fontSize: '0.95rem', marginBottom: 20}}>{selectedTicket.operation}</p>
                <p style={{color: '#94a3b8', fontSize: '0.9rem', marginBottom: 4}}>Raised Date</p>
                <p style={{color: '#334155', fontWeight: 500, fontSize: '0.95rem'}}>{selectedTicket.raisedOn ? selectedTicket.raisedOn.split(',')[0] : '01 Mar, 2024'}</p>
              </div>
              <div style={{width: '2px', background: '#dcfce7', margin: '0 24px'}} />
              <div style={{flex: 1.5}}>
                <p style={{color: '#94a3b8', fontSize: '0.9rem', marginBottom: 4}}>Transaction ID</p>
                <p style={{color: '#334155', fontWeight: 500, fontSize: '0.95rem', marginBottom: 20}}>{selectedTicket.transactionId || 'N/A'}</p>
                <p style={{color: '#94a3b8', fontSize: '0.9rem', marginBottom: 4}}>Status</p>
                <span style={{background: getStatusColor(selectedTicket.status).bg, color: getStatusColor(selectedTicket.status).text, padding: '4px 10px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600}}>
                   {selectedTicket.status}
                </span>
              </div>
              <div style={{width: '2px', background: '#dcfce7', margin: '0 24px'}} />
              <div style={{flex: 2}}>
                <p style={{color: '#94a3b8', fontSize: '0.9rem', marginBottom: 4}}>Description</p>
                <p style={{color: '#334155', fontSize: '0.9rem', lineHeight: 1.5}}>{selectedTicket.description || 'No description provided.'}</p>
              </div>
            </div>
          </div>

          {/* Bottom Panel - Messages */}
          <div style={{background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)'}}>
            <div style={{padding: '16px 24px', borderBottom: '1px solid #f1f5f9'}}>
              <h3 style={{fontSize: '1rem', fontWeight: 600, color: '#1e293b'}}>Messages</h3>
            </div>
            <div style={{padding: 24, display: 'flex', flexDirection: 'column', gap: 24}}>
              <div style={{display: 'flex', justifyContent: 'center'}}>
                <button style={{background: '#2563eb', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 20, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 500}}>
                  <ArrowUp size={14} /> Show Older Messages
                </button>
              </div>

              {ticketMessages.map(msg => (
                <div key={msg.id} style={{display: 'flex', gap: 16}}>
                  {msg.isMe ? (
                    <div style={{width: 40, height: 40, minWidth: 40, borderRadius: '50%', overflow: 'hidden'}}>
                      <img src="https://i.pravatar.cc/150?img=11" alt="avatar" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    </div>
                  ) : (
                    <div style={{width: 40, height: 40, minWidth: 40, borderRadius: '50%', background: '#94a3b8', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, position: 'relative'}}>
                      {msg.initials}
                      <div style={{position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, background: '#4ade80', borderRadius: '50%', border: '2px solid white'}}></div>
                    </div>
                  )}
                  <div>
                    <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4}}>
                      <span style={{fontWeight: 600, color: '#334155'}}>{msg.sender}</span>
                      <span style={{fontSize: '0.8rem', color: '#94a3b8'}}>{msg.time}</span>
                    </div>
                    <p style={{color: '#475569', fontSize: '0.9rem', lineHeight: 1.5}}>{msg.text}</p>
                  </div>
                </div>
              ))}

              {/* Input Area */}
              <div style={{marginTop: 16, border: '1px solid #cbd5e1', borderRadius: 8, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 12}}>
                <div style={{width: 32, height: 32, borderRadius: '50%', background: '#94a3b8', overflow: 'hidden', minWidth: 32}}>
                  <img src="https://i.pravatar.cc/150?img=11" alt="avatar" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                </div>
                <input 
                  type="text" 
                  placeholder="Reply here..." 
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  style={{border: 'none', outline: 'none', width: '100%', color: '#334155', fontSize: '0.95rem'}} 
                />
                <button onClick={handleSendMessage} style={{background: 'none', border: 'none', cursor: 'pointer', padding: 4}}><Send size={20} color="#334155" /></button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
      
      {/* Container 1: Filters */}
      <div style={{background: 'white', padding: 24, borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', marginBottom: 24}}>
        <div style={{display: 'flex', gap: 24}}>
          <div style={{flex: 1, maxWidth: '280px'}}>
            <label className="input-label" style={{color: '#64748b', fontSize: '0.9rem', marginBottom: 8, display: 'block'}}>Start Date</label>
            <input type="date" className="input-field" style={{marginBottom: 0, width: '100%', color: '#94a3b8'}} value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} />
          </div>
          <div style={{flex: 1, maxWidth: '280px'}}>
            <label className="input-label" style={{color: '#64748b', fontSize: '0.9rem', marginBottom: 8, display: 'block'}}>End Date</label>
            <input type="date" className="input-field" style={{marginBottom: 0, width: '100%', color: '#94a3b8'}} value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} />
          </div>
          <div style={{flex: 1, maxWidth: '280px'}}>
            <label className="input-label" style={{color: '#64748b', fontSize: '0.9rem', marginBottom: 8, display: 'block'}}>Ticket Status</label>
            <select className="input-field" style={{marginBottom: 0, width: '100%', color: '#94a3b8'}} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option>Select Ticket Status</option>
              <option value="Pending">Pending</option>
              <option value="Unresolved">Unresolved</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          <div style={{display: 'flex', alignItems: 'flex-end'}}>
             <button className="btn-primary" onClick={handleFilterSubmit} style={{height: '42px', padding: '0 24px'}}>Submit</button>
          </div>
        </div>
      </div>

      {/* Container 2: Table Section */}
      <div style={{background: 'white', padding: 24, borderRadius: 'var(--radius)', border: '1px solid var(--border-color)'}}>
        
        {/* Search Bar */}
        <div style={{marginBottom: 24, border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, width: 'max-content', minWidth: '320px'}}>
          <Search size={18} color="#94a3b8" />
          <input type="text" placeholder="Enter Username" style={{border: 'none', outline: 'none', background: 'none', fontSize: '0.95rem', width: '100%', color: '#334155'}} />
        </div>

        <div style={{overflowX: 'auto'}}>
          <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
            <thead>
              <tr style={{borderBottom: '1px solid #f1f5f9', background: '#fdfdfd'}}>
                <th style={{padding: '16px 12px', color: '#64748b', fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap'}}><div style={{display: 'flex', alignItems: 'center', gap: 6}}>Transaction ID <ChevronsUpDown size={14} color="#cbd5e1" /></div></th>
                <th style={{padding: '16px 12px', color: '#64748b', fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap'}}><div style={{display: 'flex', alignItems: 'center', gap: 6}}>Raised On <ChevronsUpDown size={14} color="#cbd5e1" /></div></th>
                <th style={{padding: '16px 12px', color: '#64748b', fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap'}}><div style={{display: 'flex', alignItems: 'center', gap: 6}}>Number <ChevronsUpDown size={14} color="#cbd5e1" /></div></th>
                <th style={{padding: '16px 12px', color: '#64748b', fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap'}}><div style={{display: 'flex', alignItems: 'center', gap: 6}}>Operation <ChevronsUpDown size={14} color="#cbd5e1" /></div></th>
                <th style={{padding: '16px 12px', color: '#64748b', fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap'}}><div style={{display: 'flex', alignItems: 'center', gap: 6}}>Status <ChevronsUpDown size={14} color="#cbd5e1" /></div></th>
                <th style={{padding: '16px 12px', color: '#64748b', fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap'}}><div style={{display: 'flex', alignItems: 'center', gap: 6}}>Action <ChevronsUpDown size={14} color="#cbd5e1" /></div></th>
              </tr>
            </thead>
            <tbody>
              {paginatedTickets.map((t, idx) => {
                const sc = getStatusColor(t.status);
                return (
                  <tr key={idx} style={{borderBottom: '1px solid #f8fafc', color: '#334155'}}>
                    <td style={{padding: '16px 12px', fontSize: '0.9rem'}}>{t.txId}</td>
                    <td style={{padding: '16px 12px', fontSize: '0.9rem'}}>{t.raisedOn}</td>
                    <td style={{padding: '16px 12px', fontSize: '0.9rem'}}>{t.number}</td>
                    <td style={{padding: '16px 12px', fontSize: '0.9rem'}}>{t.operation}</td>
                    <td style={{padding: '16px 12px'}}>
                      <span style={{
                        background: sc.bg, color: sc.text,
                        padding: '6px 12px', borderRadius: 4, fontSize: '0.8rem', fontWeight: 600
                      }}>
                        {t.status}
                      </span>
                    </td>
                    <td style={{padding: '16px 12px'}}>
                      <button style={{color: '#2563eb', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem'}} onClick={() => setSelectedTicket(t)}>
                        View Details
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 24, color: '#64748b', fontSize: '0.9rem'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <span>Row per page</span>
            <select 
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
                setGoToPageInput('1');
              }}
              style={{border: '1px solid #cbd5e1', borderRadius: 4, padding: '4px 8px', outline: 'none', color: '#334155', background: 'white', cursor: 'pointer'}}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>Go to</span>
            <input 
              type="text" 
              value={goToPageInput}
              onChange={handleGoToChange}
              style={{border: '1px solid #cbd5e1', borderRadius: 4, padding: '4px 8px', outline: 'none', width: '40px', textAlign: 'center', color: '#334155'}} 
            />
          </div>

          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1px solid #e2e8f0', borderRadius: 4, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: currentPage === 1 ? '#cbd5e1' : '#64748b'}}
            >
              <ChevronLeft size={16} />
            </button>

            {getPageNumbers().map((num, i) => (
              num === '...' ? (
                <span key={i} style={{color: '#94a3b8', padding: '0 4px'}}>...</span>
              ) : (
                <button 
                  key={i} 
                  onClick={() => handlePageChange(num)}
                  style={{
                    width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', 
                    border: num === currentPage ? '1px solid var(--primary-blue)' : '1px solid #e2e8f0', 
                    borderRadius: 4, cursor: 'pointer', 
                    color: num === currentPage ? 'var(--primary-blue)' : '#64748b', 
                    fontWeight: num === currentPage ? 600 : 400, 
                    fontSize: '0.9rem'
                  }}
                >
                  {num}
                </button>
              )
            ))}

            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              style={{width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1px solid #e2e8f0', borderRadius: 4, cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer', color: (currentPage === totalPages || totalPages === 0) ? '#cbd5e1' : '#64748b'}}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      </>
      )}

      <Modal isOpen={showRaiseTicket} title="Raise a Query" actions={
        <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
          <button 
            onClick={() => setShowRaiseTicket(false)} 
            style={{background: 'transparent', border: 'none', color: '#ef4444', fontWeight: 500, cursor: 'pointer'}}
          >
            Cancel
          </button>
          <button className="btn-primary" onClick={handleTicketSubmit}>Submit</button>
        </div>
      }>
        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          <div>
            <label className="input-label" style={{display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-main)'}}>Reason</label>
            <select className="input-field" style={{width: '100%'}} value={reason} onChange={(e) => setReason(e.target.value)}>
              <option value="">Please Select Reason</option>
              <option value="Transaction Declined">Transaction Declined</option>
              <option value="Failed but deducted">Failed but deducted</option>
              <option value="Refund not received">Refund not received</option>
              <option value="App crashed on pay">App crashed on pay</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="input-label" style={{display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-main)'}}>Transaction ID</label>
            <input className="input-field" style={{width: '100%'}} placeholder="Enter the Transaction ID" value={txId} onChange={(e) => setTxId(e.target.value)} />
          </div>
          <div>
            <label className="input-label" style={{display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-main)'}}>Description</label>
            <textarea className="input-field" style={{width: '100%'}} rows="3" placeholder="Any additional details..." value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>
          <div>
            <label className="input-label" style={{display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-main)'}}>Attachment</label>
            <div 
              onClick={() => fileInputRef.current.click()}
              style={{
              border: '1px dashed #cbd5e1',
              borderRadius: '6px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: attachmentName ? 'var(--text-main)' : '#94a3b8',
              cursor: 'pointer',
              fontSize: '0.95rem',
              background: attachmentName ? '#f8fafc' : 'transparent'
            }}>
              <Paperclip size={18} />
              <span>{attachmentName || 'Please Add Attachment'}</span>
              <input type="file" ref={fileInputRef} style={{display:'none'}} onChange={handleFileChange} />
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showCloseConfirm} title="Close Ticket?" actions={
        <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
          <button 
            onClick={() => setShowCloseConfirm(false)} 
            style={{background: 'transparent', border: 'none', color: '#ef4444', fontWeight: 500, cursor: 'pointer', fontSize: '0.9rem'}}
          >
            Cancel
          </button>
          <button 
            style={{background: '#ef4444', color: 'white', border: 'none', padding: '8px 24px', borderRadius: 4, fontWeight: 500, cursor: 'pointer', fontSize: '0.9rem'}}
            onClick={() => {
              const updated = tickets.map(t => t.txId === selectedTicket.txId ? {...t, status: 'Resolved'} : t);
              setTickets(updated);
              setSelectedTicket({...selectedTicket, status: 'Resolved'});
              setShowCloseConfirm(false);
            }}
          >
            Close
          </button>
        </div>
      }>
        {selectedTicket && (
          <div style={{border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, marginBottom: 16}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16}}>
              <Flag size={16} color="#334155" />
              <h3 style={{fontSize: '1rem', fontWeight: 500, color: '#334155'}}>Ticket ID: #{selectedTicket.txId}</h3>
            </div>
            
            <div style={{display: 'flex', marginBottom: 16}}>
              <div style={{flex: 1}}>
                <p style={{color: '#64748b', fontSize: '0.85rem', marginBottom: 4}}>Reason Type</p>
                <p style={{color: '#334155', fontSize: '0.9rem', fontWeight: 500}}>{selectedTicket.operation}</p>
              </div>
              <div style={{flex: 1}}>
                <p style={{color: '#64748b', fontSize: '0.85rem', marginBottom: 4}}>Raised Date</p>
                <p style={{color: '#334155', fontSize: '0.9rem', fontWeight: 500}}>{selectedTicket.raisedOn.split(',')[0]}</p>
              </div>
            </div>

            <div style={{borderTop: '1px solid #e2e8f0', paddingTop: 16, display: 'flex'}}>
              <div style={{flex: 1}}>
                <p style={{color: '#64748b', fontSize: '0.85rem', marginBottom: 4}}>Transaction ID</p>
                <p style={{color: '#334155', fontSize: '0.9rem', fontWeight: 500}}>{selectedTicket.transactionId || 'N/A'}</p>
              </div>
              <div style={{flex: 1}}>
                <p style={{color: '#64748b', fontSize: '0.85rem', marginBottom: 4}}>Status</p>
                <span style={{background: getStatusColor(selectedTicket.status).bg, color: getStatusColor(selectedTicket.status).text, padding: '4px 10px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 500}}>
                  {selectedTicket.status}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
