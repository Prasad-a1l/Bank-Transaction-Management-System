import React, { useState, useEffect } from 'react';
import { Wallet, Activity, ArrowUpRight, ArrowDownRight, UserPlus, X, RefreshCw } from 'lucide-react';
import api from './api/client';
import TransactionModal from './components/TransactionModal';
import AccountDetails from './components/AccountDetails';
import './App.css';

function App() {
  const [accounts, setAccounts] = useState([]);
  const [activeAccount, setActiveAccount] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await api.get('/accounts');
      setAccounts(res.data);
      if (res.data.length > 0 && !activeAccount) {
        setActiveAccount(res.data[0]);
      } else if (activeAccount) {
        // Refresh active account
        const updated = res.data.find(a => a.accountNumber === activeAccount.accountNumber);
        if (updated) setActiveAccount(updated);
      }
    } catch (err) {
      console.error("Failed to fetch accounts", err);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/accounts', {
        customerName: newCustomerName,
        initialBalance: initialBalance || 0
      });
      setAccounts([...accounts, res.data]);
      setActiveAccount(res.data);
      setShowCreateModal(false);
      setNewCustomerName('');
      setInitialBalance('');
    } catch (err) {
      alert("Failed to create account. Check console.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="glass-panel" style={{ padding: '12px', borderRadius: '12px', display: 'flex' }}>
            <Wallet size={28} color="var(--accent)" />
          </div>
          <div>
            <h1 className="text-gradient" style={{ margin: 0, fontSize: '1.75rem' }}>NovaBank</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>Next-Gen Financial Platform</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <UserPlus size={18} />
          New Account
        </button>
      </header>

      <main className="sidebar-grid">
        <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
          <h2 style={{ marginBottom: '20px', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="var(--accent)" />
            Your Accounts
          </h2>
          {accounts.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No accounts found. Create one to get started.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {accounts.map(acc => (
                <div 
                  key={acc.id} 
                  className="glass-panel"
                  style={{ 
                    padding: '16px', 
                    cursor: 'pointer',
                    border: activeAccount?.id === acc.id ? '1px solid var(--accent)' : '',
                    background: activeAccount?.id === acc.id ? 'var(--bg-card-hover)' : ''
                  }}
                  onClick={() => setActiveAccount(acc)}
                >
                  <p style={{ fontWeight: '500', marginBottom: '4px' }}>{acc.customerName}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    <span>{acc.accountNumber}</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                      ${acc.balance.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {activeAccount ? (
            <AccountDetails account={activeAccount} refreshData={fetchAccounts} />
          ) : (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <Wallet size={48} style={{ opacity: 0.5, margin: '0 auto 16px' }} />
              <h3>Select an account</h3>
              <p>Choose an account from the list to view details and transactions.</p>
            </div>
          )}
        </div>
      </main>

      {showCreateModal && (
        <div className="modal-overlay">
          <form className="glass-panel modal-content" onSubmit={handleCreateAccount}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0 }}>Open Account</h2>
              <button type="button" onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label className="input-label">Customer Name</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="John Doe" 
                required
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label className="input-label">Initial Balance ($)</label>
              <input 
                type="number" 
                className="input-field" 
                placeholder="0.00" 
                min="0"
                step="0.01"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? <RefreshCw size={18} className="spin" /> : 'Create Account'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
