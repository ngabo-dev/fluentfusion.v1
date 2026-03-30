import React, { useEffect, useState } from 'react'
import api from '../../api/client'
import { BookOpen, Crown, Flame, Gem, Globe, GraduationCap, MessageCircle, MessageSquare, Mic, Music, Sparkles, Swords, Target, Trophy, Zap } from 'lucide-react'

export default function Achievements() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    api.get('/api/student/dashboard').then(r => setData(r.data)).catch(() => {})
  }, [])

  const earned = [
    { icon: <Target size={16} />, name: 'First Step', desc: 'Completed your very first lesson', xp: '+50 XP', date: 'Jan 10' },
    { icon: <Flame size={16} />, name: '7-Day Streak', desc: '7 consecutive days of learning', xp: '+100 XP', date: 'Feb 5' },
    { icon: <Zap size={16} />, name: 'Speed Learner', desc: 'Completed 5 lessons in one day', xp: '+150 XP', date: 'Jan 15' },
    { icon: <Trophy size={16} />, name: 'Perfect Score', desc: '100% on any quiz', xp: '+200 XP', date: 'Jan 18' },
    { icon: <BookOpen size={16} />, name: 'Bookworm', desc: 'Completed 20 lessons total', xp: '+100 XP', date: 'Feb 1' },
    { icon: <MessageSquare size={16} />, name: 'Conversationalist', desc: 'Posted 5 community questions', xp: '+75 XP', date: 'Feb 10' },
    { icon: <Mic size={16} />, name: 'Pronunciation Pro', desc: '90%+ on speaking practice', xp: '+150 XP', date: 'Feb 12' },
    { icon: <Globe size={16} />, name: 'Multilingual', desc: 'Enrolled in 2 language courses', xp: '+100 XP', date: 'Feb 14' },
  ]
  const locked = [
    { icon: <Gem size={16} />, name: 'Diamond Streak', desc: '30-day streak', xp: '+500 XP' },
    { icon: <Crown size={16} />, name: 'Top Learner', desc: 'Rank #1 on weekly leaderboard', xp: '+300 XP' },
    { icon: <GraduationCap size={16} />, name: 'Graduate', desc: 'Complete an entire course', xp: '+400 XP' },
    { icon: <MessageCircle size={16} />, name: 'Fluent', desc: 'Reach 90% fluency score', xp: '+600 XP' },
    { icon: <Sparkles size={16} />, name: 'Polyglot', desc: 'Learn 3 languages', xp: '+500 XP' },
    { icon: <Swords size={16} />, name: 'Challenger', desc: 'Complete 30 daily challenges', xp: '+250 XP' },
    { icon: <Music size={16} />, name: 'Rhythm Master', desc: '95%+ on speaking rhythm', xp: '+200 XP' },
    { icon: <Sparkles size={16} />, name: 'Sage', desc: 'Reach level 20', xp: '+1000 XP' },
  ]

  return (
    <div className="pg">
      <div className="ph">
        <div><h1>Achievements</h1><p>{earned.length} of {earned.length + locked.length} badges earned · Keep learning to unlock more!</p></div>
      </div>

      <div className="sr" style={{ marginBottom: 28 }}>
        <div className="sc"><div className="sl">Badges Earned</div><div className="sv">{earned.length}</div><div className="ss2">of {earned.length + locked.length} total</div></div>
        <div className="sc"><div className="sl">XP from Badges</div><div className="sv">1,200</div><div className="ss2">+50 this week</div></div>
        <div className="sc"><div className="sl">Rarest Badge</div><div className="sv" style={{ fontSize: 28 }}><Zap size={16} /></div><div className="ss2">Speed Learner</div></div>
        <div className="sc"><div className="sl">Next Badge</div><div className="sv" style={{ fontSize: 28 }}><Flame size={16} /></div><div className="ss2">14-Day Streak · 7 left</div></div>
      </div>

      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '.12em', color: 'var(--neon)', textTransform: 'uppercase', marginBottom: 16 }}>Earned · {earned.length} Badges</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 32 }}>
        {earned.map(a => (
          <div key={a.name} className="card" style={{ textAlign: 'center', border: '1px solid rgba(191,255,0,.2)', background: 'rgba(191,255,0,.03)' }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>{a.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{a.name}</div>
            <div style={{ fontSize: 11, color: 'var(--mu)', lineHeight: 1.4, marginBottom: 8 }}>{a.desc}</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--neon)', fontWeight: 600 }}>{a.xp} · Earned {a.date}</div>
          </div>
        ))}
      </div>

      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '.12em', color: 'var(--mu2)', textTransform: 'uppercase', marginBottom: 16 }}>Locked · {locked.length} Badges</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {locked.map(a => (
          <div key={a.name} className="card" style={{ textAlign: 'center', opacity: .35, filter: 'grayscale(1)' }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>{a.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{a.name}</div>
            <div style={{ fontSize: 11, color: 'var(--mu)', lineHeight: 1.4, marginBottom: 8 }}>{a.desc}</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--mu)', fontWeight: 600 }}>{a.xp}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
