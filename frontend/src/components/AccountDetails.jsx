import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, RefreshCw, Calendar } from 'lucide-react';
import api from '../api/client';
import TransactionModal from './TransactionModal';

function AccountDetails({ account, refreshData }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState(null); // 'DEPOSIT' or 'WITHDRAWAL'

  useEffect(() => {
    if (account) {
      fetchTransactions();
    }
  }, [account]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/accounts/${account.accountNumber}/transactions`);
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionSuccess = () => {
    setModalType(null);
    refreshData();
    fetchTransactions();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="glass-panel" style={{ padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Available Balance</p>
          <h1 style={{ fontSize: '3rem', margin: 0, fontWeight: '700' }}>
            ${account.balance.toFixed(2)}
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.875rem' }}>
            Account: {account.accountNumber} • {account.customerName}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-success" onClick={() => setModalType('DEPOSIT')}>
            <ArrowDownRight size={18} />
            Deposit
          </button>
          <button className="btn btn-danger" onClick={() => setModalType('WITHDRAWAL')}>
            <ArrowUpRight size={18} />
            Withdraw
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Recent Transactions</h3>
          <button 
            onClick={fetchTransactions} 
            className="btn" 
            style={{ background: 'transparent', padding: '6px', color: 'var(--text-secondary)' }}
          >
            <RefreshCw size={18} className={loading ? 'spin' : ''} />
          </button>
        </div>

        {transactions.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px 0' }}>No transactions recorded.</p>
        ) : (
          <ul className="transaction-list">
            {transactions.map(tx => (
              <li key={tx.id} className="transaction-item">
                <div className="flex-row">
                  <div className={`transaction-icon ${tx.type === 'DEPOSIT' ? 'deposit' : 'withdrawal'}`}>
                    {tx.type === 'DEPOSIT' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <p style={{ fontWeight: '500', marginBottom: '2px' }}>{tx.type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} />
                      {new Date(tx.transactionDate).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div style={{ fontWeight: '600', color: tx.type === 'DEPOSIT' ? 'var(--success)' : 'var(--text-primary)' }}>
                  {tx.type === 'DEPOSIT' ? '+' : '-'}${tx.amount.toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {modalType && (
        <TransactionModal 
          type={modalType} 
          accountNumber={account.accountNumber}
          onClose={() => setModalType(null)}
          onSuccess={handleTransactionSuccess}
        />
      )}
    </div>
  );
}

export default AccountDetails;
