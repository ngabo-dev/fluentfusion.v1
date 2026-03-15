import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import StatCard from '../../components/StatCard'

export default function GeoData() {
  const [data, setData] = useState<any>(null)
  useEffect(() => { api.get('/api/admin/geo').then(r => setData(r.data)) }, [])
  if (!data) return <div className="loading" />
  const maxUsers = Math.max(...data.countries.map((c: any) => c.users))

  return (
    <div className="pg">
      <div className="ph"><div><h1>Geographic Data</h1><p>User and revenue distribution by country</p></div></div>
      <div className="sr sr3">
        <StatCard label="Countries" value="47" sub="Across 6 continents" />
        <StatCard label="Top Country" value="Rwanda" sub="6,420 users (22.6%)" variant="ok" />
        <StatCard label="International Users" value="77.4%" sub="Outside top country" variant="in" />
      </div>
      <div className="g21">
        <div className="card">
          <div className="ch"><span className="ch-t">Country Distribution</span></div>
          <div className="gr">
            {data.countries.map((c: any) => (
              <div key={c.name} className="geo">
                <span className="gf">{c.flag}</span>
                <span className="gn" style={{ width: 105 }}>{c.name}</span>
                <div className="gb"><div className="gfil" style={{ width: `${Math.round(c.users / maxUsers * 85)}%` }} /></div>
                <span className="gv" style={{ color: 'var(--neon)' }}>{c.users.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="ch"><span className="ch-t">By Language</span></div>
          <div className="gr">
            {data.languages.map((l: any, i: number) => {
              const colors = ['var(--neon)','var(--ok)','var(--in)','var(--wa)','var(--er)','#FF8C00']
              const maxL = data.languages[0].users
              return (
                <div key={l.name} className="geo">
                  <span className="gf">{l.flag}</span><span className="gn">{l.name}</span>
                  <div className="gb"><div className="gfil" style={{ width: `${Math.round(l.users/maxL*82)}%`, background: colors[i] }} /></div>
                  <span className="gv" style={{ color: colors[i] }}>{l.users.toLocaleString()}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
