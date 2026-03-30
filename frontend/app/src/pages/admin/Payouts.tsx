import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import Avatar from '../../components/Avatar'
import { Banknote } from 'lucide-react'

export default function Payouts() {
  const [payouts, setPayouts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('pending')
  const load = () => { setLoading(true); api.get('/api/admin/payouts', { params: { status: tab } }).then(r => setPayouts(r.data)).catch(() => {}).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [tab])

  async function update(id: number, status: string) { await api.patch(`/api/admin/payouts/${id}/status`, { status }); load() }

  const total = payouts.filter(p => p.status === 'pending').reduce((a, p) => a + p.amount, 0)

  if (loading) return <div className="pgload" />

  return (
    <div className="pg">
      <div className="ph"><div><h1>Payouts</h1><p>Instructor payout management</p></div></div>
      {tab === 'pending' && payouts.length > 0 && (
        <div className="alr aw" style={{ marginBottom: 14 }}>
          <span><Banknote size={16} /></span><div style={{ flex: 1 }}><b>{payouts.length} payout requests awaiting approval — total ${total.toLocaleString()}</b></div>
        </div>
      )}
      <div className="tabs">
        {['pending','approved','paid','rejected'].map(t => (
          <div key={t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)} {tab === t ? `(${payouts.length})` : ''}
          </div>
        ))}
      </div>
      <div className="card">
        <table className="tbl"><thead><tr><th>Reference</th><th>Instructor</th><th>Amount</th><th>Requested</th><th>Status</th><th></th></tr></thead>
        <tbody>{payouts.map(p => (
          <tr key={p.id}>
            <td style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--mu)' }}>{p.reference}</td>
            <td><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Avatar initials={p.avatar_initials || p.instructor.slice(0,2).toUpperCase()} />{p.instructor}</div></td>
            <td style={{ fontWeight: 600 }}>${p.amount?.toLocaleString()}</td>
            <td style={{ color: 'var(--mu)', fontSize: 10 }}>{p.requested_at?.slice(0,10)}</td>
            <td>{p.status === 'pending' ? <span className="bdg bw">Pending</span> : p.status === 'approved' ? <span className="bdg bi">Approved</span> : p.status === 'paid' ? <span className="bdg bk">Paid</span> : <span className="bdg be">Rejected</span>}</td>
            <td><div style={{ display: 'flex', gap: 5 }}>
              {p.status === 'pending' && <><button className="btn bp sm" onClick={() => update(p.id, 'approved')}>Approve</button><button className="btn bd sm" onClick={() => update(p.id, 'rejected')}>Reject</button></>}
              {p.status === 'approved' && <button className="btn bo sm" onClick={() => update(p.id, 'paid')}>Mark as Paid</button>}
            </div></td>
          </tr>
        ))}</tbody></table>
      </div>
    </div>
  )
}
