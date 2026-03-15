import React, { useEffect, useState } from 'react'
import api from '../../api/client'

export default function Payouts() {
  const [data, setData] = useState<any>(null)
  const [requesting, setRequesting] = useState(false)
  const load = () => api.get('/api/instructor/payouts').then(r => setData(r.data))
  useEffect(() => { load() }, [])
  if (!data) return <div className="loading" />

  async function requestPayout() {
    if (!data.available_balance || data.available_balance <= 0) return
    setRequesting(true)
    await api.post('/api/instructor/payouts', { amount: data.available_balance })
    load()
    setRequesting(false)
  }

  return (
    <div className="pg">
      <div className="ph"><div><h1>Payouts</h1><p>Manage your withdrawal requests</p></div></div>
      <div className="card" style={{ marginBottom: 18, borderColor: 'rgba(191,255,0,.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: 'var(--mu)', textTransform: 'uppercase', marginBottom: 5 }}>Available Balance</div>
            <div style={{ fontFamily: 'Syne', fontSize: 34, fontWeight: 800, color: 'var(--neon)' }}>${data.available_balance?.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 3 }}>Platform fee: 30% already deducted</div>
          </div>
          <button className="btn bp" onClick={requestPayout} disabled={requesting || data.available_balance <= 0}>
            {requesting ? 'Requesting...' : 'Request Payout'}
          </button>
        </div>
      </div>
      <div className="card">
        <div className="ch"><span className="ch-t">Payout History</span></div>
        <table className="tbl"><thead><tr><th>Reference</th><th>Amount</th><th>Status</th><th>Requested</th><th>Paid</th><th></th></tr></thead>
        <tbody>{data.payouts?.map((p: any) => (
          <tr key={p.id}>
            <td style={{ fontFamily: 'JetBrains Mono', color: 'var(--mu)', fontSize: 9 }}>{p.reference}</td>
            <td style={{ fontWeight: 600 }}>${p.amount?.toLocaleString()}</td>
            <td>{p.status === 'pending' ? <span className="bdg bw">Pending</span> : p.status === 'paid' ? <span className="bdg bk">Paid</span> : p.status === 'approved' ? <span className="bdg bi">Approved</span> : <span className="bdg be">Rejected</span>}</td>
            <td style={{ color: 'var(--mu)' }}>{p.requested_at?.slice(0,10)}</td>
            <td style={{ color: 'var(--mu)' }}>{p.paid_at?.slice(0,10) || '—'}</td>
            <td>{p.status === 'pending' && <button className="btn bd sm">Cancel</button>}</td>
          </tr>
        ))}</tbody></table>
      </div>
    </div>
  )
}
