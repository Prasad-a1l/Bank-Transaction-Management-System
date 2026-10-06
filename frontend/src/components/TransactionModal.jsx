import React, { useState } from 'react';
import { X, RefreshCw } from 'lucide-react';
import api from '../api/client';

function TransactionModal({ type, accountNumber, onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const endpoint = type === 'DEPOSIT' ? '/accounts/deposit' : '/accounts/withdraw';
      await api.post(endpoint, {
        accountNumber,
        amount: parseFloat(amount)
      });
      onSuccess();
    } catch (err) {
      if (err.response && err.response.data) {
        // Handle Map<String, String> error format from GlobalExceptionHandler
        const errData = err.response.data;
        if (errData.error) {
          setError(errData.error);
        } else {
          setError("Validation failed. Please verify amount.");
        }
      } else {
        setError("Network error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <form className="glass-panel modal-content" onSubmit={handleSubmit}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0 }}>{type === 'DEPOSIT' ? 'Make a Deposit' : 'Withdraw Funds'}</h2>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>
        
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}
        
        <div style={{ marginBottom: '24px' }}>
          <label className="input-label">Amount ($)</label>
          <input 
            type="number" 
            className="input-field" 
            placeholder="0.00" 
            min="0.01"
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            autoFocus
          />
        </div>
        
        <button 
          type="submit" 
          className={`btn ${type === 'DEPOSIT' ? 'btn-success' : 'btn-danger'}`} 
          style={{ width: '100%' }} 
          disabled={loading}
        >
          {loading ? <RefreshCw size={18} className="spin" /> : (type === 'DEPOSIT' ? 'Confirm Deposit' : 'Confirm Withdrawal')}
        </button>
      </form>
    </div>
  );
}

export default TransactionModal;
