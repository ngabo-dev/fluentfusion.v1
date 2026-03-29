import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usersApi } from '../../api/client'
import { Bot, Brain, Globe, Trophy, Video, Sparkles, Target, Users, BookOpen, MessageCircle, Award, ChevronRight, Play, Star, Zap, Shield, Clock, ArrowRight } from 'lucide-react'

const LANGS = [
  { flag: '🇷🇼', name: 'Kinyarwanda' },
  { flag: '🇬🇧', name: 'English' },
  { flag: '🇫🇷', name: 'French' },
  { flag: '🇪🇸', name: 'Spanish' },
  { flag: '🇩🇪', name: 'German' },
  { flag: '🇯🇵', name: 'Japanese' },
]

const TESTIMONIALS = [
  { name: 'Sarah K.', role: 'Marketing Manager', avatar: '👩‍💼', text: 'FluentFusion helped me become fluent in French in just 6 months. The AI personalized lessons were exactly what I needed!', rating: 5 },
  { name: 'James M.', role: 'Software Engineer', avatar: '👨‍💻', text: 'The live sessions with native speakers transformed my Spanish. I went from basic to conversational in 3 months.', rating: 5 },
  { name: 'Aisha R.', role: 'University Student', avatar: '👩‍🎓', text: 'The gamification keeps me motivated every day. I\'ve maintained a 90-day streak and learned 500+ new words!', rating: 5 },
  { name: 'Carlos D.', role: 'Business Owner', avatar: '👨‍💼', text: 'Best investment for my team. Our international communication improved dramatically after using FluentFusion.', rating: 5 },
]

const HOW_IT_WORKS = [
  { icon: <Target size={24} />, title: '1. Set Your Goals', desc: 'Tell us what you want to achieve and your current level. Our AI creates a personalized roadmap.' },
  { icon: <Sparkles size={24} />, title: '2. Learn with AI', desc: 'Adaptive lessons that adjust to your pace, focusing on areas where you need the most practice.' },
  { icon: <Users size={24} />, title: '3. Practice Live', desc: 'Join live sessions with certified instructors and practice with learners from around the world.' },
  { icon: <Award size={24} />, title: '4. Track Progress', desc: 'Monitor your fluency score, earn badges, and celebrate milestones on your journey to fluency.' },
]

const PRICING_PLANS = [
  { name: 'Free', price: '$0', period: 'forever', features: ['5 lessons per day', 'Basic AI personalization', 'Community access', 'Progress tracking'], popular: false },
  { name: 'Pro', price: '$12', period: 'per month', features: ['Unlimited lessons', 'Advanced AI coaching', 'Live sessions (5/month)', 'Priority support', 'Offline mode'], popular: true },
  { name: 'Team', price: '$29', period: 'per month', features: ['Everything in Pro', 'Unlimited live sessions', 'Team analytics', 'Custom learning paths', 'Dedicated manager', 'API access'], popular: false },
]

const FAQS = [
  { q: 'How does the AI personalization work?', a: 'Our AI analyzes your learning patterns, strengths, and areas for improvement to create customized lesson plans that adapt in real-time as you progress.' },
  { q: 'Can I switch languages anytime?', a: 'Yes! You can learn multiple languages simultaneously or switch between them at any time with no additional cost.' },
  { q: 'Are the instructors certified?', a: 'All our instructors are certified native speakers with extensive teaching experience and undergo rigorous vetting.' },
  { q: 'Is there a free trial?', a: 'Yes! Our Free plan gives you access to core features forever. You can upgrade anytime to unlock advanced features.' },
  { q: 'How do live sessions work?', a: 'Live sessions are conducted via video with certified instructors. You can book sessions that fit your schedule and practice speaking in real-time.' },
]

export default function Welcome() {
  const nav = useNavigate()
  const [activeLang, setActiveLang] = useState(0)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [stats, setStats] = useState({ active_learners: 0, languages: 0, courses: 0, instructors: 0, success_rate: 0 })

  useEffect(() => {
    usersApi.getPlatformStats().then(d => setStats(d)).catch(() => {})
  }, [])

  const fmt = (n: number, fallback: string) =>
    n >= 1000000 ? (n / 1000000).toFixed(1) + 'M+' : n >= 1000 ? (n / 1000).toFixed(0) + 'K+' : n ? n + '+' : fallback

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)', fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{ height: 66, background: 'rgba(10,10,10,0.95)', borderBottom: '1px solid #2a2a2a', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none' }}>
          <div style={{ width: 38, height: 38, background: '#BFFF00', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}><Brain size={16} /></div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#fff' }}>
            FLUENT<span style={{ color: '#BFFF00' }}>FUSION</span>
          </div>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {[['Features', '/features'], ['Pricing', '/pricing'], ['Community', '/community']].map(([l, href]) => (
            <a key={String(l)} onClick={() => nav(String(href))} style={{ fontSize: 14, color: '#888', textDecoration: 'none', cursor: 'pointer' }}>{String(l)}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => nav('/login')} style={{ display: 'inline-flex', alignItems: 'center', padding: '11px 24px', borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none', background: 'transparent', color: '#888', transition: 'all .18s' }}
            onMouseEnter={e => { (e.target as HTMLElement).style.color = '#fff'; (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.05)' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.color = '#888'; (e.target as HTMLElement).style.background = 'transparent' }}>
            Login
          </button>
          <button onClick={() => nav('/signup')} style={{ display: 'inline-flex', alignItems: 'center', padding: '11px 24px', borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none', background: '#BFFF00', color: '#0a0a0a', boxShadow: '0 0 12px rgba(191,255,0,0.25)', transition: 'all .18s' }}
            onMouseEnter={e => { (e.target as HTMLElement).style.background = '#8FEF00' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.background = '#BFFF00' }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: 'calc(100vh - 66px)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 40px', position: 'relative', overflow: 'hidden' }}>
        {/* bg glow */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(191,255,0,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        {/* grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(42,42,42,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(42,42,42,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px', WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 80%)', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 80%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 760 }}>
          {/* eyebrow */}
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.2em', color: '#BFFF00', textTransform: 'uppercase', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <span style={{ display: 'block', width: 32, height: 1, background: '#BFFF00', opacity: 0.5 }} />
            AI-Powered Language Learning
            <span style={{ display: 'block', width: 32, height: 1, background: '#BFFF00', opacity: 0.5 }} />
          </div>

          {/* title */}
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(44px, 6vw, 76px)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1.0, marginBottom: 24 }}>
            BREAKING<br />LANGUAGE<br />
            <span style={{ color: '#BFFF00', textShadow: '0 0 12px rgba(191,255,0,0.55), 0 0 24px rgba(191,255,0,0.28)' }}>BARRIERS</span>
          </h1>

          <p style={{ fontSize: 18, color: '#888', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 40px' }}>
            Master any language with AI-personalized lessons, live sessions, and a global community of learners.
          </p>

          {/* CTA */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginBottom: 64, flexWrap: 'wrap' }}>
            <button onClick={() => nav('/signup')} style={{ display: 'inline-flex', alignItems: 'center', padding: '15px 36px', borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600, cursor: 'pointer', border: 'none', background: '#BFFF00', color: '#0a0a0a', boxShadow: '0 0 12px rgba(191,255,0,0.25)', transition: 'all .18s' }}
              onMouseEnter={e => { (e.target as HTMLElement).style.background = '#8FEF00'; (e.target as HTMLElement).style.boxShadow = '0 0 24px rgba(191,255,0,0.30), 0 0 48px rgba(191,255,0,0.14)' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.background = '#BFFF00'; (e.target as HTMLElement).style.boxShadow = '0 0 12px rgba(191,255,0,0.25)' }}>
              Get Started Free →
            </button>
            <button onClick={() => nav('/login')} style={{ display: 'inline-flex', alignItems: 'center', padding: '15px 36px', borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600, cursor: 'pointer', background: 'transparent', color: '#fff', border: '1px solid #333', transition: 'all .18s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#BFFF00'; (e.currentTarget as HTMLElement).style.color = '#BFFF00' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#333'; (e.currentTarget as HTMLElement).style.color = '#fff' }}>
              Sign In
            </button>
          </div>

          {/* lang pills label */}
          <div style={{ marginBottom: 16, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', color: '#555', textTransform: 'uppercase' }}>
            Select language to learn
          </div>

          {/* lang pills */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {LANGS.map((l, i) => (
              <div key={l.name} onClick={() => setActiveLang(i)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px', background: i === activeLang ? 'rgba(191,255,0,0.10)' : '#151515', border: `1px solid ${i === activeLang ? '#BFFF00' : '#2a2a2a'}`, borderRadius: 99, fontSize: 13, fontWeight: 500, cursor: 'pointer', color: i === activeLang ? '#BFFF00' : '#fff', transition: 'all .15s' }}>
                <span style={{ fontSize: 16 }}>{l.flag}</span>
                {l.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <div style={{ display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap', padding: 32, borderTop: '1px solid #2a2a2a', borderBottom: '1px solid #2a2a2a', background: 'rgba(255,255,255,0.01)' }}>
        {[
          [fmt(stats.active_learners, '2M+'), 'Active Learners'],
          [fmt(stats.languages, '40+'), 'Languages'],
          [fmt(stats.courses, '500+'), 'Courses'],
          [stats.success_rate ? stats.success_rate + '%' : '98%', 'Success Rate'],
          [fmt(stats.instructors, '150+'), 'Expert Instructors'],
        ].map(([val, label]) => (
          <div key={String(label)} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800, color: '#BFFF00', textShadow: '0 0 12px rgba(191,255,0,0.55), 0 0 24px rgba(191,255,0,0.28)' }}>{String(val)}</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{String(label)}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <section style={{ padding: '80px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.2em', color: '#BFFF00', textTransform: 'uppercase', marginBottom: 12 }}>Why Choose Us</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 16 }}>Powerful Features</h2>
          <p style={{ fontSize: 16, color: '#888', maxWidth: 600, margin: '0 auto' }}>Everything you need to achieve fluency faster than traditional methods.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, maxWidth: 1200, margin: '0 auto' }}>
          {[
            { icon: <Bot size={20} />,         title: 'AI Personalization',    desc: 'Adaptive lessons that adjust to your pace and learning style in real time.' },
            { icon: <Video size={20} />,        title: 'Live Sessions',         desc: 'Join real-time classes with certified native-speaker instructors.' },
            { icon: <Trophy size={20} />,       title: 'Gamification',          desc: 'Streaks, XP, badges, and leaderboards to keep you motivated daily.' },
            { icon: <Globe size={20} />,        title: 'Global Community',      desc: 'Practice with millions of learners worldwide in discussion threads.' },
            { icon: <BookOpen size={20} />,     title: 'Structured Curriculum', desc: 'Expert-designed courses from beginner to advanced levels.' },
            { icon: <MessageCircle size={20} />,title: 'Speaking Practice',     desc: 'AI-powered conversation partners available 24/7 for practice.' },
            { icon: <Zap size={20} />,          title: 'Instant Feedback',      desc: 'Get real-time corrections on pronunciation and grammar.' },
            { icon: <Shield size={20} />,       title: 'Progress Protection',   desc: 'Never lose your progress with cloud sync across all devices.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ background: '#151515', border: '1px solid #2a2a2a', borderRadius: 14, padding: 28, textAlign: 'left', transition: 'all .2s', cursor: 'default' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(191,255,0,0.25)'; (e.currentTarget as HTMLElement).style.background = 'rgba(191,255,0,0.03)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2a2a2a'; (e.currentTarget as HTMLElement).style.background = '#151515' }}>
              <div style={{ width: 44, height: 44, background: 'rgba(191,255,0,0.10)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: '#BFFF00' }}>{icon}</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 14, color: '#888', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 40px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid #2a2a2a', borderBottom: '1px solid #2a2a2a' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.2em', color: '#BFFF00', textTransform: 'uppercase', marginBottom: 12 }}>Simple Process</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 16 }}>How It Works</h2>
          <p style={{ fontSize: 16, color: '#888', maxWidth: 600, margin: '0 auto' }}>Start your language journey in four simple steps.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, maxWidth: 1000, margin: '0 auto' }}>
          {HOW_IT_WORKS.map((step, i) => (
            <div key={i} style={{ background: '#151515', border: '1px solid #2a2a2a', borderRadius: 14, padding: 32, textAlign: 'center', position: 'relative', transition: 'all .2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(191,255,0,0.25)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2a2a2a' }}>
              <div style={{ width: 56, height: 56, background: 'rgba(191,255,0,0.10)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#BFFF00' }}>{step.icon}</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{step.title}</div>
              <div style={{ fontSize: 14, color: '#888', lineHeight: 1.6 }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '80px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.2em', color: '#BFFF00', textTransform: 'uppercase', marginBottom: 12 }}>Success Stories</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 16 }}>What Learners Say</h2>
          <p style={{ fontSize: 16, color: '#888', maxWidth: 600, margin: '0 auto' }}>Join thousands of successful language learners worldwide.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, maxWidth: 1200, margin: '0 auto' }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{ background: '#151515', border: '1px solid #2a2a2a', borderRadius: 14, padding: 28, transition: 'all .2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(191,255,0,0.25)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2a2a2a' }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                {[...Array(t.rating)].map((_, j) => <Star key={j} size={16} fill="#BFFF00" color="#BFFF00" />)}
              </div>
              <p style={{ fontSize: 14, color: '#ccc', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 32 }}>{t.avatar}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: '80px 40px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid #2a2a2a', borderBottom: '1px solid #2a2a2a' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.2em', color: '#BFFF00', textTransform: 'uppercase', marginBottom: 12 }}>Pricing</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 16 }}>Choose Your Plan</h2>
          <p style={{ fontSize: 16, color: '#888', maxWidth: 600, margin: '0 auto' }}>Start free and scale as you grow. No hidden fees.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, maxWidth: 1000, margin: '0 auto' }}>
          {PRICING_PLANS.map((plan, i) => (
            <div key={i} style={{ background: plan.popular ? 'rgba(191,255,0,0.05)' : '#151515', border: `1px solid ${plan.popular ? '#BFFF00' : '#2a2a2a'}`, borderRadius: 14, padding: 32, position: 'relative', transition: 'all .2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}>
              {plan.popular && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#BFFF00', color: '#0a0a0a', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Most Popular</div>}
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{plan.name}</div>
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 42, fontWeight: 800, color: plan.popular ? '#BFFF00' : '#fff' }}>{plan.price}</span>
                <span style={{ fontSize: 14, color: '#888', marginLeft: 4 }}>/{plan.period}</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
                {plan.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#ccc', marginBottom: 12 }}>
                    <ChevronRight size={14} color="#BFFF00" />
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => nav('/signup')} style={{ width: '100%', padding: '14px', borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer', border: plan.popular ? 'none' : '1px solid #333', background: plan.popular ? '#BFFF00' : 'transparent', color: plan.popular ? '#0a0a0a' : '#fff', transition: 'all .18s' }}
                onMouseEnter={e => { if (!plan.popular) { (e.target as HTMLElement).style.borderColor = '#BFFF00'; (e.target as HTMLElement).style.color = '#BFFF00' } }}
                onMouseLeave={e => { if (!plan.popular) { (e.target as HTMLElement).style.borderColor = '#333'; (e.target as HTMLElement).style.color = '#fff' } }}>
                {plan.popular ? 'Get Started' : 'Start Free'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.2em', color: '#BFFF00', textTransform: 'uppercase', marginBottom: 12 }}>Support</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 16 }}>Frequently Asked Questions</h2>
          <p style={{ fontSize: 16, color: '#888', maxWidth: 600, margin: '0 auto' }}>Everything you need to know about FluentFusion.</p>
        </div>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ borderBottom: '1px solid #2a2a2a' }}>
              <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: activeFaq === i ? '#BFFF00' : '#fff', transition: 'color .15s' }}>{faq.q}</span>
                <ChevronRight size={18} color={activeFaq === i ? '#BFFF00' : '#555'} style={{ transform: activeFaq === i ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform .2s' }} />
              </button>
              {activeFaq === i && (
                <div style={{ fontSize: 14, color: '#888', lineHeight: 1.7, paddingBottom: 20, paddingLeft: 0 }}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ padding: '100px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden', borderTop: '1px solid #2a2a2a' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(191,255,0,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 20 }}>Ready to Start Your Journey?</h2>
          <p style={{ fontSize: 18, color: '#888', lineHeight: 1.7, marginBottom: 36 }}>Join millions of learners and break language barriers today. Start free, no credit card required.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => nav('/signup')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 40px', borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600, cursor: 'pointer', border: 'none', background: '#BFFF00', color: '#0a0a0a', boxShadow: '0 0 16px rgba(191,255,0,0.30)', transition: 'all .18s' }}
              onMouseEnter={e => { (e.target as HTMLElement).style.background = '#8FEF00'; (e.target as HTMLElement).style.boxShadow = '0 0 32px rgba(191,255,0,0.35)' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.background = '#BFFF00'; (e.target as HTMLElement).style.boxShadow = '0 0 16px rgba(191,255,0,0.30)' }}>
              Get Started Free <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '60px 40px 28px', borderTop: '1px solid #2a2a2a', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, maxWidth: 1200, margin: '0 auto 48px' }}>
          <div>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none', marginBottom: 16 }}>
              <div style={{ width: 34, height: 34, background: '#BFFF00', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}><Brain size={16} /></div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#fff' }}>
                FLUENT<span style={{ color: '#BFFF00' }}>FUSION</span>
              </div>
            </a>
            <p style={{ fontSize: 13, color: '#888', lineHeight: 1.6 }}>AI-powered language learning platform helping millions break language barriers worldwide.</p>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product</div>
            {['Features', 'Pricing', 'Community', 'Mobile App'].map(l => (
              <a key={l} href="#" style={{ display: 'block', fontSize: 13, color: '#888', textDecoration: 'none', marginBottom: 10, transition: 'color .15s' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = '#BFFF00' }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = '#888' }}>{l}</a>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Company</div>
            {['About Us', 'Careers', 'Blog', 'Press'].map(l => (
              <a key={l} href="#" style={{ display: 'block', fontSize: 13, color: '#888', textDecoration: 'none', marginBottom: 10, transition: 'color .15s' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = '#BFFF00' }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = '#888' }}>{l}</a>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Support</div>
            {['Help Center', 'Contact', 'Privacy Policy', 'Terms of Service'].map(l => (
              <a key={l} href="#" style={{ display: 'block', fontSize: 13, color: '#888', textDecoration: 'none', marginBottom: 10, transition: 'color .15s' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = '#BFFF00' }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = '#888' }}>{l}</a>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ fontSize: 12, color: '#555' }}>© 2026 FluentFusion AI · All rights reserved</div>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Twitter', 'LinkedIn', 'GitHub', 'Discord'].map(l => (
              <a key={l} href="#" style={{ fontSize: 12, color: '#555', textDecoration: 'none', transition: 'color .15s' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = '#BFFF00' }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = '#555' }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  )
}
