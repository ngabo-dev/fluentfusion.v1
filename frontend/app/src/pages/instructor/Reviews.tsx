import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import StatCard from '../../components/StatCard'
import Avatar from '../../components/Avatar'

export default function Reviews() {
  const [data, setData] = useState<any>(null)
  const [replyId, setReplyId] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')
  useEffect(() => { api.get('/api/instructor/reviews').then(r => setData(r.data)) }, [])
  if (!data) return <div className="loading" />

  async function submitReply(id: number) {
    await api.patch(`/api/instructor/reviews/${id}/reply`, { reply: replyText })
    setReplyId(null); setReplyText('')
    api.get('/api/instructor/reviews').then(r => setData(r.data))
  }

  const dist = data.distribution ?? {}

  return (
    <div className="pg">
      <div className="ph"><div><h1>Reviews</h1><p>Student feedback across all your courses</p></div></div>
      <div className="sr">
        <StatCard label="Overall Rating" value={data.avg_rating || '—'} sub="★★★★★" />
        <StatCard label="Total Reviews" value={data.total} sub="Across all courses" />
        <StatCard label="5-Star Reviews" value={dist[5] || 0} sub={`${Math.round((dist[5]||0)/Math.max(data.total,1)*100)}% of total`} variant="ok" />
        <StatCard label="Last 30 Days" value={data.reviews?.filter((r: any) => new Date(r.created_at) > new Date(Date.now() - 30*86400000)).length || 0} sub="New reviews" variant="in" />
      </div>
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="ch"><span className="ch-t">Rating Distribution</span></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[5,4,3,2,1].map(star => {
            const count = dist[star] || 0
            const pct = Math.round(count / Math.max(data.total, 1) * 100)
            const colors = ['var(--neon)','var(--ok)','var(--wa)','#FF8C00','var(--er)']
            return (
              <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ fontSize: 10, color: 'var(--wa)', width: 22 }}>★{star}</span>
                <div style={{ flex: 1, height: 5, background: 'var(--bdr)', borderRadius: 99 }}><div style={{ width: `${pct}%`, height: '100%', background: colors[5-star], borderRadius: 99 }} /></div>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--mu)', width: 24, textAlign: 'right' }}>{count}</span>
              </div>
            )
          })}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.reviews?.map((r: any) => (
          <div key={r.id} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 9 }}>
              <Avatar initials={r.avatar_initials || r.student.slice(0,2).toUpperCase()} />
              <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 600 }}>{r.student}</div><div style={{ fontSize: 10, color: 'var(--mu)' }}>{r.course} · {r.created_at?.slice(0,10)}</div></div>
              <span style={{ color: 'var(--wa)' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--mu)', marginBottom: 9 }}>"{r.comment}"</p>
            {r.reply ? (
              <div style={{ background: 'var(--card2)', borderRadius: 'var(--r)', padding: 9, border: '1px solid var(--bdr)' }}>
                <div style={{ fontSize: 9, color: 'var(--mu)', fontFamily: 'JetBrains Mono', marginBottom: 3 }}>YOUR REPLY</div>
                <p style={{ fontSize: 11 }}>{r.reply}</p>
              </div>
            ) : replyId === r.id ? (
              <div>
                <textarea className="inp" rows={2} placeholder="Write your reply..." value={replyText} onChange={e => setReplyText(e.target.value)} style={{ marginBottom: 7 }} />
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn bp sm" onClick={() => submitReply(r.id)}>Submit Reply</button>
                  <button className="btn bg sm" onClick={() => setReplyId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <button className="btn bo sm" onClick={() => setReplyId(r.id)}>Reply</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
