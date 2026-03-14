import React from 'react';

// ── Spinner ──────────────────────────────────────────────────
export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, border: `2px solid var(--bdr2)`,
      borderTop: `2px solid var(--neon)`, borderRadius: '50%',
      animation: 'spin 0.8s linear infinite', display: 'inline-block'
    }} />
  );
}

// ── Badge ────────────────────────────────────────────────────
type BadgeVariant = 'neon' | 'ok' | 'warn' | 'error' | 'info' | 'muted';
export function Badge({ children, variant = 'muted' }: { children: React.ReactNode; variant?: BadgeVariant }) {
  const styles: Record<BadgeVariant, React.CSSProperties> = {
    neon: { background: 'var(--ndim)', color: 'var(--neon)', border: '1px solid rgba(191,255,0,.2)' },
    ok: { background: 'rgba(0,255,127,.1)', color: 'var(--ok)' },
    warn: { background: 'rgba(255,184,0,.1)', color: 'var(--wa)' },
    error: { background: 'rgba(255,68,68,.1)', color: 'var(--er)' },
    info: { background: 'rgba(0,207,255,.1)', color: 'var(--in)' },
    muted: { background: 'rgba(255,255,255,.06)', color: 'var(--mu)', border: '1px solid var(--bdr)' },
  };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '2px 8px',
      borderRadius: 99, fontSize: 10, fontWeight: 600, letterSpacing: '.03em',
      ...styles[variant]
    }}>
      {children}
    </span>
  );
}

export function PulseBadge({ state }: { state: string }) {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    thriving: { label: '🚀 Thriving', variant: 'ok' },
    coasting: { label: '😐 Coasting', variant: 'info' },
    struggling: { label: '😓 Struggling', variant: 'warn' },
    burning_out: { label: '🔥 Burning Out', variant: 'warn' },
    disengaged: { label: '💤 Disengaged', variant: 'error' },
  };
  const { label, variant } = map[state] || { label: state, variant: 'muted' as BadgeVariant };
  return <Badge variant={variant}>{label}</Badge>;
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeVariant> = {
    active: 'ok', pending: 'warn', draft: 'muted', rejected: 'error',
    archived: 'muted', approved: 'ok', thriving: 'ok',
  };
  return <Badge variant={map[status] || 'muted'}>{status}</Badge>;
}

// ── Button ───────────────────────────────────────────────────
type BtnVariant = 'primary' | 'outline' | 'ghost' | 'danger';
interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?: 'sm' | 'md';
  loading?: boolean;
}
export function Btn({ children, variant = 'primary', size = 'md', loading, style, ...props }: BtnProps) {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderRadius: 'var(--r)', fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
    cursor: 'pointer', border: 'none', transition: 'all .15s', whiteSpace: 'nowrap',
    padding: size === 'sm' ? '4px 11px' : '7px 16px',
    fontSize: size === 'sm' ? 11 : 12,
  };
  const variants: Record<BtnVariant, React.CSSProperties> = {
    primary: { background: 'var(--neon)', color: '#000' },
    outline: { background: 'transparent', color: 'var(--fg)', border: '1px solid var(--bdr2)' },
    ghost: { background: 'transparent', color: 'var(--mu)', border: 'none' },
    danger: { background: 'rgba(255,68,68,.1)', color: 'var(--er)', border: '1px solid rgba(255,68,68,.25)' },
  };
  return (
    <button style={{ ...base, ...variants[variant], ...style }} disabled={loading || props.disabled} {...props}>
      {loading ? <Spinner size={12} /> : children}
    </button>
  );
}

// ── Input ────────────────────────────────────────────────────
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input style={{
      width: '100%', background: 'var(--inp)', border: '1px solid var(--bdr)',
      borderRadius: 'var(--r)', padding: '9px 12px', fontSize: 12, color: 'var(--fg)',
      outline: 'none', transition: 'border-color .15s',
    }}
      onFocus={e => (e.target.style.borderColor = 'var(--neon)')}
      onBlur={e => (e.target.style.borderColor = 'var(--bdr)')}
      {...props}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select style={{
      width: '100%', background: 'var(--inp)', border: '1px solid var(--bdr)',
      borderRadius: 'var(--r)', padding: '8px 10px', fontSize: 12, color: 'var(--fg)',
      outline: 'none', appearance: 'none', cursor: 'pointer',
    }} {...props} />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea style={{
      width: '100%', background: 'var(--inp)', border: '1px solid var(--bdr)',
      borderRadius: 'var(--r)', padding: '9px 12px', fontSize: 12, color: 'var(--fg)',
      outline: 'none', resize: 'vertical', minHeight: 80,
    }}
      onFocus={e => (e.target.style.borderColor = 'var(--neon)')}
      onBlur={e => (e.target.style.borderColor = 'var(--bdr)')}
      {...props}
    />
  );
}

// ── Label ────────────────────────────────────────────────────
export function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{
      fontFamily: 'JetBrains Mono, monospace', fontSize: 8, fontWeight: 500,
      letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mu)',
      display: 'block', marginBottom: 5,
    }}>
      {children}
    </label>
  );
}

export function FormGroup({ children }: { children: React.ReactNode }) {
  return <div style={{ marginBottom: 14 }}>{children}</div>;
}

// ── Card ─────────────────────────────────────────────────────
export function Card({ children, style, hover = true }: { children: React.ReactNode; style?: React.CSSProperties; hover?: boolean }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--card)', border: `1px solid ${hovered ? 'rgba(191,255,0,.15)' : 'var(--bdr)'}`,
        borderRadius: 'var(--rl)', padding: 18, transition: 'border-color .2s', ...style,
      }}>
      {children}
    </div>
  );
}

export function StatCard({
  label, value, sub, color = 'neon', accent,
}: { label: string; value: string | number; sub?: string; color?: string; accent?: string }) {
  const colorMap: Record<string, string> = {
    neon: 'var(--neon)', ok: 'var(--ok)', warn: 'var(--wa)', error: 'var(--er)', info: 'var(--in)',
  };
  const accentMap: Record<string, string> = {
    neon: 'var(--neon)', ok: 'var(--ok)', warn: 'var(--wa)', error: 'var(--er)', info: 'var(--in)',
  };
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 'var(--rl)',
      padding: '16px 18px', position: 'relative', overflow: 'hidden',
      transition: 'transform .2s, border-color .2s',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${accentMap[accent || color] || 'var(--neon)'}, transparent)`,
      }} />
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mu)', marginBottom: 7 }}>{label}</div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 800, color: colorMap[color] || color, lineHeight: 1, marginBottom: 3 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--mu)' }}>{sub}</div>}
    </div>
  );
}

// ── Table ────────────────────────────────────────────────────
export function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} style={{
              textAlign: 'left', padding: '6px 10px',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '.15em',
              textTransform: 'uppercase', color: 'var(--mu)', borderBottom: '1px solid var(--bdr)',
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

export function TR({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{ background: hovered ? 'rgba(191,255,0,.015)' : 'transparent', cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </tr>
  );
}

export function TD({ children, style }: { children?: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <td style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,.04)', fontSize: 12, verticalAlign: 'middle', ...style }}>
      {children}
    </td>
  );
}

// ── Avatar ───────────────────────────────────────────────────
export function Avatar({ initials, size = 'sm' }: { initials?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 28, md: 38, lg: 60 };
  const px = sizes[size];
  return (
    <div style={{
      width: px, height: px, borderRadius: '50%',
      background: 'linear-gradient(135deg, var(--neon), var(--neon2))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#000',
      fontSize: size === 'lg' ? 20 : size === 'md' ? 14 : 10,
      flexShrink: 0,
    }}>
      {initials || '?'}
    </div>
  );
}

// ── Progress Bar ─────────────────────────────────────────────
export function ProgressBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 4, background: 'var(--bdr)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, var(--neon2), var(--neon))', borderRadius: 99 }} />
      </div>
      <span style={{ fontSize: 11, color: 'var(--mu)', minWidth: 32 }}>{pct}%</span>
    </div>
  );
}

// ── Section Header ───────────────────────────────────────────
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--mu2)', padding: '12px 18px 3px' }}>
      {children}
    </div>
  );
}

// ── Page Header ──────────────────────────────────────────────
export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
      <div>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-.01em', marginBottom: 2 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 11, color: 'var(--mu)' }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>{actions}</div>}
    </div>
  );
}

// ── Mono text ────────────────────────────────────────────────
export function Mono({ children, color }: { children: React.ReactNode; color?: string }) {
  return <span style={{ fontFamily: 'JetBrains Mono, monospace', color: color || 'inherit' }}>{children}</span>;
}

// ── Toggle ───────────────────────────────────────────────────
export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 32, height: 18, borderRadius: 99, cursor: 'pointer', position: 'relative',
        background: checked ? 'var(--neon)' : 'var(--bdr2)', transition: 'background .2s', flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 2, left: checked ? 16 : 2, width: 14, height: 14,
        borderRadius: '50%', background: checked ? '#000' : 'var(--mu)', transition: 'left .2s',
      }} />
    </div>
  );
}

// ── Tabs ─────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid var(--bdr)', marginBottom: 18 }}>
      {tabs.map(tab => (
        <div
          key={tab}
          onClick={() => onChange(tab)}
          style={{
            padding: '9px 16px', fontSize: 11, fontWeight: 500, cursor: 'pointer',
            color: active === tab ? 'var(--neon)' : 'var(--mu)',
            borderBottom: `2px solid ${active === tab ? 'var(--neon)' : 'transparent'}`,
            marginBottom: -1, transition: 'all .13s',
          }}
        >
          {tab}
        </div>
      ))}
    </div>
  );
}

// ── Empty State ──────────────────────────────────────────────
export function EmptyState({ icon = '📭', message = 'No data found' }: { icon?: string; message?: string }) {
  return (
    <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--mu)' }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 12 }}>{message}</div>
    </div>
  );
}

// ── Alert ────────────────────────────────────────────────────
export function Alert({ type = 'info', children }: { type?: 'info' | 'warn' | 'error' | 'ok'; children: React.ReactNode }) {
  const styles: Record<string, { bg: string; border: string; color: string }> = {
    info: { bg: 'rgba(0,207,255,.06)', border: 'rgba(0,207,255,.2)', color: 'var(--in)' },
    warn: { bg: 'rgba(255,184,0,.06)', border: 'rgba(255,184,0,.2)', color: 'var(--wa)' },
    error: { bg: 'rgba(255,68,68,.06)', border: 'rgba(255,68,68,.2)', color: 'var(--er)' },
    ok: { bg: 'rgba(0,255,127,.06)', border: 'rgba(0,255,127,.2)', color: 'var(--ok)' },
  };
  const s = styles[type];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
      background: s.bg, border: `1px solid ${s.border}`, borderRadius: 'var(--r)',
      fontSize: 11, color: s.color, marginBottom: 14,
    }}>
      {children}
    </div>
  );
}

// ── Search bar ───────────────────────────────────────────────
export function SearchBar({ value, onChange, placeholder = 'Search...' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={{ position: 'relative', flex: 1, maxWidth: 280 }}>
      <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--mu)', fontSize: 12 }}>🔍</span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', background: 'var(--inp)', border: '1px solid var(--bdr)',
          borderRadius: 'var(--r)', padding: '9px 12px 9px 30px', fontSize: 12, color: 'var(--fg)',
          outline: 'none',
        }}
      />
    </div>
  );
}

// ── Donut-style pulse indicator ──────────────────────────────
export function PulseBar({ thriving, coasting, struggling, burning_out, disengaged, total }: any) {
  if (!total) return null;
  const segments = [
    { key: 'thriving', color: 'var(--ok)', pct: thriving / total * 100 },
    { key: 'coasting', color: 'var(--in)', pct: coasting / total * 100 },
    { key: 'struggling', color: 'var(--wa)', pct: struggling / total * 100 },
    { key: 'burning_out', color: '#FF8C00', pct: burning_out / total * 100 },
    { key: 'disengaged', color: 'var(--er)', pct: disengaged / total * 100 },
  ];
  return (
    <div>
      <div style={{ display: 'flex', height: 6, borderRadius: 99, overflow: 'hidden', gap: 2, marginBottom: 10 }}>
        {segments.map(s => (
          <div key={s.key} style={{ flex: s.pct, background: s.color, transition: 'flex .4s' }} />
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { label: '🚀 Thriving', count: thriving, color: 'var(--ok)' },
          { label: '😐 Coasting', count: coasting, color: 'var(--in)' },
          { label: '😓 Struggling', count: struggling, color: 'var(--wa)' },
          { label: '🔥 Burning Out', count: burning_out, color: '#FF8C00' },
          { label: '💤 Disengaged', count: disengaged, color: 'var(--er)' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, color: 'var(--mu)', width: 100 }}>{item.label}</span>
            <div style={{ flex: 1, height: 4, background: 'var(--bdr)', borderRadius: 99 }}>
              <div style={{ width: `${(item.count / total) * 100}%`, height: '100%', background: item.color, borderRadius: 99 }} />
            </div>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: item.color, minWidth: 30 }}>
              {Math.round((item.count / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Modal ────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,.7)', backdropFilter: 'blur(4px)',
    }} onClick={onClose}>
      <div style={{
        background: 'var(--card)', border: '1px solid var(--bdr)', borderRadius: 'var(--rl)',
        padding: 24, width: '100%', maxWidth: 520, maxHeight: '80vh', overflowY: 'auto',
        animation: 'fadeUp .2s ease both',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 800, textTransform: 'uppercase' }}>{title}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--mu)', fontSize: 18, cursor: 'pointer' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
