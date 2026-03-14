import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Btn, Input, Label, FormGroup } from '../components/UI';

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('chidi@fluentfusion.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) {
    navigate(user.role === 'admin' ? '/admin' : '/instructor');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(email, password);
      const stored = localStorage.getItem('ff_user');
      const u = stored ? JSON.parse(stored) : null;
      navigate(u?.role === 'admin' ? '/admin' : '/instructor');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (role: 'admin' | 'instructor') => {
    setLoading(true); setError('');
    const creds = role === 'admin'
      ? { email: 'chidi@fluentfusion.com', password: 'admin123' }
      : { email: 'amara@fluentfusion.com', password: 'instructor123' };
    try {
      await login(creds.email, creds.password);
      navigate(role === 'admin' ? '/admin' : '/instructor');
    } catch {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: 'linear-gradient(var(--neon) 1px, transparent 1px), linear-gradient(90deg, var(--neon) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />
      <div style={{ position: 'absolute', top: '20%', left: '20%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,255,0,.04) 0%, transparent 70%)' }} />

      <div style={{ width: '100%', maxWidth: 400, position: 'relative', animation: 'fadeUp .4s ease both' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, background: 'var(--neon)', borderRadius: 12,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, color: '#000',
            marginBottom: 12, boxShadow: 'var(--nglow)',
          }}>FF</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, textTransform: 'uppercase' }}>
            Fluent<span style={{ color: 'var(--neon)' }}>Fusion</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--mu)', marginTop: 4 }}>Staff Dashboard</div>
        </div>

        <div style={{ background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 'var(--rl)', padding: 28 }}>
          <form onSubmit={handleLogin}>
            <FormGroup>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </FormGroup>
            <FormGroup>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </FormGroup>
            {error && <div style={{ color: 'var(--er)', fontSize: 11, marginBottom: 12 }}>{error}</div>}
            <Btn type="submit" loading={loading} style={{ width: '100%', marginBottom: 12 }}>
              Sign In
            </Btn>
          </form>

          <div style={{ borderTop: '1px solid var(--bdr)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 10, color: 'var(--mu2)', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '.1em', textTransform: 'uppercase' }}>Quick Access</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <Btn variant="outline" onClick={() => quickLogin('admin')} loading={loading} size="sm">
                👑 Admin Demo
              </Btn>
              <Btn variant="outline" onClick={() => quickLogin('instructor')} loading={loading} size="sm">
                🎓 Instructor Demo
              </Btn>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 10, color: 'var(--mu2)' }}>
          FluentFusion © 2025 · ALU Capstone Project
        </div>
      </div>
    </div>
  );
}
