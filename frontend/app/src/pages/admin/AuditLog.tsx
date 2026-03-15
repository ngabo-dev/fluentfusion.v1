import React, { useEffect, useState } from 'react'
import api from '../../api/client'

export default function AuditLog() {
  const [logs, setLogs] = useState<any[]>([])
  useEffect(() => { api.get('/api/admin/audit-log').then(r => setLogs(r.data)) }, [])

  const typeClass: any = { USER: 'lw3', COURSE: 'lw3', FINANCE: 'li3', SYSTEM: 'li3' }
  const criticalTypes = ['SYSTEM']

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>Audit Log</h1><p>Complete record of all admin actions</p></div>
        <div className="pa"><button className="btn bo sm">Export Log</button></div>
      </div>
      <div className="alr ai" style={{ marginBottom: 14 }}>
        <span>🔒</span><div>This log records all administrator actions. Entries cannot be modified or deleted.</div>
      </div>
      <div className="ab">
        <select className="sel" style={{ width: 'auto' }}><option>All Admins</option></select>
        <select className="sel" style={{ width: 'auto' }}><option>All Actions</option><option>USER</option><option>COURSE</option><option>FINANCE</option><option>SYSTEM</option></select>
        <input className="inp" type="date" style={{ width: 'auto' }} />
        <input className="inp" type="date" style={{ width: 'auto' }} />
      </div>
      <div className="card">
        <div className="ll">
          {logs.map(l => (
            <div key={l.id} className="llog">
              <span className="ltm">{l.created_at?.slice(11,19) || l.created_at?.slice(0,10)}</span>
              <span className={`llv ${l.action_type === 'SYSTEM' && l.description?.includes('breach') ? 'le3' : typeClass[l.action_type] || 'li3'}`}>{l.action_type}</span>
              <span className="lm" dangerouslySetInnerHTML={{ __html: l.description?.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') || l.description }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
