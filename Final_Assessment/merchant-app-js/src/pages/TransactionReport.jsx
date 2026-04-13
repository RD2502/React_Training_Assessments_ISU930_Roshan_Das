import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { format } from 'date-fns';
import { Search, Download, ChevronLeft, ChevronRight, ArrowUpDown, Calendar } from 'lucide-react';

export default function TransactionReport() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('Monthly');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [monthlyOption, setMonthlyOption] = useState('3');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [goToPageInput, setGoToPageInput] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    let start = '';
    let end = format(new Date(), 'dd/MM/yyyy');

    if (filterType === 'Today') {
      start = end;
    } else if (filterType === 'Monthly') {
      const pastDate = new Date();
      pastDate.setMonth(pastDate.getMonth() - parseInt(monthlyOption));
      start = format(pastDate, 'dd/MM/yyyy');
    } else if (filterType === 'Custom Range') {
      if (startDate && endDate) {
        start = format(new Date(startDate), 'dd/MM/yyyy');
        end = format(new Date(endDate), 'dd/MM/yyyy');
      } else {
        start = end; // Fallback directly on empty form submits
      }
    }

    const data = await ApiService.report(start, end);
    
    // Map live backend API return fields directly into UI standard format securely
    const formattedData = Array.isArray(data) ? data.map((item, idx) => ({
      serialNo: idx + 1,
      id: item.txn_id || item.transactionId || item.id || `TXN${1000 + idx}`,
      amount: (item.amount || item.total_amount || 0).toLocaleString('en-IN'),
      rawDate: item.date || item.created_date || item.txn_date || new Date(),
      dateStr: item.date || item.created_date || item.txn_date ? item.date || item.created_date || item.txn_date : format(new Date(), 'dd/MM/yyyy, hh:mm a'),
      status: item.status || item.txn_status || 'Success',
    })) : [];

    setReports(formattedData);
    setLoading(false);
    setCurrentPage(1);
  };

  const handleDownloadCSV = () => {
    if (!reports || reports.length === 0) return;
    
    const headers = ['S. No.', 'Transaction ID', 'Amount', 'Date', 'Status'];
    const csvRows = reports.map(r => {
      const amountStr = `"${r.amount}"`;
      const dateStr = `"${r.dateStr}"`;
      return [r.serialNo, r.id, amountStr, dateStr, r.status].join(',');
    });
    
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'transaction_reports.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.ceil(reports.length / rowsPerPage) || 1;
  const currentTableData = reports.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPageInput('');
    }
  };

  const handleGoTo = (e) => {
    if (e.key === 'Enter') {
      const pageNum = parseInt(goToPageInput, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        setCurrentPage(pageNum);
      }
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) buttons.push(i);
    } else {
      if (currentPage <= 4) {
        buttons.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        buttons.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        buttons.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return buttons.map((btn, index) => {
      if (btn === '...') {
        return <span key={`ellipsis-${index}`} style={{ margin: '0 4px', color: 'var(--text-muted)' }}>...</span>;
      }
      return (
        <button 
          key={btn}
          onClick={() => handlePageChange(btn)}
          style={{
            padding: '6px 12px', 
            background: currentPage === btn ? '#eff6ff' : 'white', 
            color: currentPage === btn ? '#3b82f6' : 'inherit',
            border: currentPage === btn ? '1px solid #3b82f6' : '1px solid var(--border-color)', 
            borderRadius: '4px', 
            cursor: 'pointer', 
            fontWeight: currentPage === btn ? 600 : 400
          }}
        >
          {btn}
        </button>
      );
    });
  };

  return (
    <div>
      <h1 style={{marginBottom: 24}}>Transaction Reports</h1>
      
      {/* Top Filter Card */}
      <div style={{background: 'white', padding: '24px 32px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '24px'}}>
        <div style={{color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.95rem', fontWeight: 500}}>Select a Report Filter</div>
        
        <div style={{display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '24px'}}>
          <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500, fontSize: '0.95rem'}}>
            <input type="radio" checked={filterType === 'Today'} onChange={() => setFilterType('Today')} />
            Today
          </label>
          <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500, fontSize: '0.95rem'}}>
            <input type="radio" checked={filterType === 'Monthly'} onChange={() => setFilterType('Monthly')} />
            Monthly
          </label>
          <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500, fontSize: '0.95rem'}}>
            <input type="radio" checked={filterType === 'Custom Range'} onChange={() => setFilterType('Custom Range')} />
            Custom Range
          </label>
        </div>

        <div>
          {filterType === 'Monthly' && (
            <>
              <div style={{color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.9rem'}}>{filterType}</div>
              <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
                <select className="input-field" style={{width: '240px', marginBottom: 0, padding: '10px 12px'}} value={monthlyOption} onChange={e => setMonthlyOption(e.target.value)}>
                  <option value="3">Last 3 Month Report</option>
                  <option value="6">Last 6 Month Report</option>
                  <option value="12">Last 1 Year Report</option>
                </select>
                <button className="btn-primary" style={{padding: '10px 24px'}} onClick={fetchData}>Submit</button>
              </div>
            </>
          )}

          {filterType === 'Custom Range' && (
            <div style={{display: 'flex', gap: '24px', alignItems: 'flex-end'}}>
              <div>
                <div style={{color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500}}>Start Date</div>
                <input 
                  type="date" 
                  className="input-field" 
                  style={{marginBottom: 0, width: '220px'}} 
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <div style={{color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500}}>End Date</div>
                <input 
                  type="date" 
                  className="input-field" 
                  style={{marginBottom: 0, width: '220px'}} 
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
              </div>
              <button className="btn-primary" style={{padding: '10px 24px', height: '43px'}} onClick={fetchData}>Submit</button>
            </div>
          )}

          {filterType === 'Today' && (
            <div style={{display: 'flex', justifyContent: 'flex-start'}}>
                <button className="btn-primary" style={{padding: '10px 24px'}} onClick={fetchData}>Submit</button>
            </div>
          )}
        </div>
      </div>

      {/* Table Card */}
      <div style={{background: 'white', borderRadius: '8px', border: '1px solid var(--border-color)', paddingBottom: '16px'}}>
        {/* Table Header Controls */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-color)'}}>
          
          <div style={{position: 'relative', width: '300px'}}>
            <Search size={18} color="var(--text-muted)" style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)'}} />
            <input 
              type="text" 
              placeholder="Search here..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%', 
                padding: '10px 12px 10px 40px', 
                border: '1px solid var(--border-color)', 
                borderRadius: '6px',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <button className="btn-primary" style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px'}} onClick={handleDownloadCSV}>
            <Download size={18} /> Download All
          </button>
        </div>

        {/* The Table */}
        <div style={{overflowX: 'auto'}}>
          <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px'}}>
            <thead>
              <tr style={{borderBottom: '1px solid var(--border-color)'}}>
                <th style={{padding: '16px 24px', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>S. No. <ArrowUpDown size={14} color="#aaa" /></div>
                </th>
                <th style={{padding: '16px 24px', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>Transaction ID <ArrowUpDown size={14} color="#aaa" /></div>
                </th>
                <th style={{padding: '16px 24px', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>Amount <ArrowUpDown size={14} color="#aaa" /></div>
                </th>
                <th style={{padding: '16px 24px', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>Date <ArrowUpDown size={14} color="#aaa" /></div>
                </th>
                <th style={{padding: '16px 24px', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>Status <ArrowUpDown size={14} color="#aaa" /></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{padding: 24, textAlign: 'center'}}>Loading...</td></tr>
              ) : currentTableData.length === 0 ? (
                <tr><td colSpan={5} style={{padding: 24, textAlign: 'center'}}>No reports found.</td></tr>
              ) : (
                currentTableData.map((r, idx) => (
                  <tr key={idx} style={{borderBottom: '1px solid #f8fafc'}}>
                    <td style={{padding: '24px', color: 'var(--text-main)'}}>{r.serialNo}</td>
                    <td style={{padding: '24px', color: 'var(--text-main)'}}>{r.id}</td>
                    <td style={{padding: '24px', color: 'var(--text-main)'}}>{r.amount}</td>
                    <td style={{padding: '24px', color: 'var(--text-main)'}}>{r.dateStr}</td>
                    <td style={{padding: '24px'}}>
                      <span style={{
                        background: '#dcfce7', 
                        color: '#16a34a',
                        padding: '6px 16px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 500
                      }}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination controls */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 24px 8px 24px', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.9rem'}}>
          
          <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              Row per page 
              <select 
                value={rowsPerPage} 
                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                style={{padding: '6px 8px', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-main)'}}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              Go to <input 
                type="number" 
                value={goToPageInput} 
                onChange={(e) => setGoToPageInput(e.target.value)} 
                onKeyDown={handleGoTo}
                placeholder={currentPage}
                min={1}
                max={totalPages}
                style={{width: '60px', padding: '6px', border: '1px solid var(--border-color)', borderRadius: '4px', textAlign: 'center'}} 
              />
            </div>
          </div>

          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <button 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1}
              style={{padding: '6px 8px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', display:'flex', opacity: currentPage === 1 ? 0.5 : 1}}
            >
              <ChevronLeft size={16} color="#aaa" />
            </button>
            
            {renderPaginationButtons()}
            
            <button 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages}
              style={{padding: '6px 8px', background: 'white', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', display:'flex', opacity: currentPage === totalPages ? 0.5 : 1}}
            >
              <ChevronRight size={16} color="#aaa" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
