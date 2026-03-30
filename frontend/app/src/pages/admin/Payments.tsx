import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import StatCard from '../../components/StatCard'
import { Search } from 'lucide-react'

export default function Payments() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  useEffect(() => { setLoading(true); api.get('/api/admin/payments', { params: status ? { status } : {} }).then(r => setPayments(r.data)).catch(() => {}).finally(() => setLoading(false)) }, [status])

  const total = payments.filter(p => p.status === 'completed').reduce((a, p) => a + p.amount, 0)

  if (loading) return <div className="pgload" />

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>Payments</h1><p>All platform transactions</p></div>
        <div className="pa"><button className="btn bo sm">Export CSV</button></div>
      </div>
      <div className="sr">
        <StatCard label="Revenue MTD" value={`$${(total/1000).toFixed(1)}k`} />
        <StatCard label="Successful" value={payments.filter(p => p.status === 'completed').length} sub="Transactions" variant="ok" />
        <StatCard label="Failed" value={payments.filter(p => p.status === 'failed').length} variant="er" />
        <StatCard label="Refunds" value={payments.filter(p => p.status === 'refunded').length} variant="wa" />
      </div>
      <div className="ab">
        <div className="sw"><span className="si2"><Search size={16} /></span><input className="inp" placeholder="Search by user or course..." /></div>
        <select className="sel" style={{ width: 'auto' }} value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All Status</option><option value="completed">Completed</option><option value="failed">Failed</option><option value="refunded">Refunded</option>
        </select>
      </div>
      <div className="card">
        <table className="tbl"><thead><tr><th>Payment ID</th><th>User</th><th>Course</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th><th></th></tr></thead>
        <tbody>{payments.map(p => (
          <tr key={p.id}>
            <td style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--mu)' }}>#TXN-{String(p.id).padStart(4,'0')}</td>
            <td>{p.user}</td><td>{p.course}</td>
            <td style={{ fontWeight: 600 }}>${p.amount?.toFixed(2)}</td>
            <td>{p.method}</td>
            <td>{p.status === 'completed' ? <span className="bdg bk">Completed</span> : p.status === 'failed' ? <span className="bdg be">Failed</span> : <span className="bdg bw">Refunded</span>}</td>
            <td style={{ color: 'var(--mu)', fontSize: 10 }}>{p.created_at?.slice(0,10)}</td>
            <td>{p.status === 'completed' && <button className="btn bd sm">Refund</button>}</td>
          </tr>
        ))}</tbody></table>
      </div>
    </div>
  )
}
