import { useState } from 'react'
import './PaymentSimulator.css'

const METHODS = [
  { id: 'upi',  label: 'UPI',        icon: '📱', placeholder: 'yourname@upi' },
  { id: 'card', label: 'Debit/Credit Card', icon: '💳', placeholder: '•••• •••• •••• ••••' },
  { id: 'net',  label: 'Net Banking', icon: '🏦', placeholder: 'Select Bank' },
]

export default function PaymentSimulator({ amount, onSuccess, disabled }) {
  const [method, setMethod]     = useState('upi')
  const [input, setInput]       = useState('')
  const [processing, setProcessing] = useState(false)

  async function handlePay() {
    if (!input.trim()) return
    setProcessing(true)
    // Simulate a 1.5s payment gateway delay
    await new Promise(r => setTimeout(r, 1500))
    setProcessing(false)
    onSuccess()
  }

  const current = METHODS.find(m => m.id === method)

  return (
    <div className="payment-sim">
      <h3 className="payment-title">💳 Payment Details</h3>

      {/* Method tabs */}
      <div className="method-tabs">
        {METHODS.map(m => (
          <button
            key={m.id}
            className={`method-tab ${method === m.id ? 'active' : ''}`}
            onClick={() => { setMethod(m.id); setInput('') }}
            disabled={processing}
          >
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="payment-input-wrap">
        <input
          type={method === 'card' ? 'text' : 'text'}
          className="form-input"
          placeholder={current.placeholder}
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={processing}
          maxLength={method === 'card' ? 19 : 50}
        />
      </div>

      {/* Amount row */}
      <div className="payment-amount-row">
        <span className="amount-label">Total Payable</span>
        <span className="amount-value">₹{Number(amount).toLocaleString('en-IN')}</span>
      </div>

      <button
        className="btn btn-primary pay-btn"
        onClick={handlePay}
        disabled={!input.trim() || processing || disabled}
      >
        {processing ? (
          <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Processing…</>
        ) : (
          `Pay ₹${Number(amount).toLocaleString('en-IN')}`
        )}
      </button>
    </div>
  )
}