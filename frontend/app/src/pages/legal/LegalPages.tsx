import React from 'react'
import LegalLayout, { LegalSection, LegalTable } from './LegalLayout'

// ── Cookie Policy ─────────────────────────────────────────────────────────

const COOKIE_SECTIONS = [
  { id: 'necessary',   title: '1. Strictly Necessary' },
  { id: 'analytics',   title: '2. Analytics Cookies' },
  { id: 'preferences', title: '3. Preference Cookies' },
  { id: 'manage',      title: '4. Managing Cookies' },
]

export function Cookies() {
  return (
    <LegalLayout title="Cookie Policy" version="1.0" lastUpdated="06 February 2026" sections={COOKIE_SECTIONS}>
      <p style={{ color: '#888', marginBottom: 32 }}>
        We use cookies to make FluentFusion work and to improve your experience. Here is exactly what we use and why.
      </p>

      <LegalSection id="necessary" title="1. Strictly Necessary Cookies">
        <p>These cookies are required for the platform to function. You cannot opt out of these.</p>
        <LegalTable
          headers={['Cookie Name', 'Purpose', 'Duration', 'Provider']}
          rows={[
            ['ff_access_token', 'Keeps you logged in', '24 hours', 'FluentFusion'],
            ['ff_user', 'Stores your session data', '24 hours', 'FluentFusion'],
            ['ff_token_expiry', 'Tracks session expiry', '24 hours', 'FluentFusion'],
          ]}
        />
      </LegalSection>

      <LegalSection id="analytics" title="2. Analytics Cookies">
        <p>These cookies help us understand how the platform is used so we can improve it. <strong style={{ color: '#fff' }}>Your consent is required.</strong></p>
        <LegalTable
          headers={['Cookie Name', 'Purpose', 'Duration', 'Provider']}
          rows={[
            ['_ga', 'Distinguishes users for Google Analytics', '2 years', 'Google'],
            ['_ga_*', 'Stores session state for Google Analytics', '2 years', 'Google'],
          ]}
        />
      </LegalSection>

      <LegalSection id="preferences" title="3. Preference Cookies">
        <p>These cookies remember your settings. <strong style={{ color: '#fff' }}>Your consent is required.</strong></p>
        <LegalTable
          headers={['Cookie Name', 'Purpose', 'Duration', 'Provider']}
          rows={[
            ['ff_theme', 'Remembers your dark/light mode preference', '1 year', 'FluentFusion'],
            ['ff_lang', 'Remembers your language preference', '1 year', 'FluentFusion'],
          ]}
        />
      </LegalSection>

      <LegalSection id="manage" title="4. Managing Your Cookie Preferences">
        <p>You can manage your cookie preferences at any time using the cookie banner at the bottom of the page, or by visiting your <a href="/dashboard/data-rights" style={{ color: '#BFFF00' }}>Data Rights Dashboard</a>.</p>
        <p style={{ marginTop: 12 }}>You can also clear cookies through your browser settings. Note that disabling strictly necessary cookies will prevent you from logging in.</p>
      </LegalSection>
    </LegalLayout>
  )
}

// ── PULSE Disclosure ──────────────────────────────────────────────────────

const PULSE_SECTIONS = [
  { id: 'what-is-pulse',  title: 'What is PULSE?' },
  { id: 'signals',        title: 'Signals Used' },
  { id: 'how-used',       title: 'How Classifications Are Used' },
  { id: 'limits',         title: 'What PULSE Does NOT Do' },
  { id: 'your-rights',    title: 'Your Rights' },
  { id: 'contact',        title: 'Contact' },
]

export function PulseDisclosure() {
  return (
    <LegalLayout
      title="PULSE AI Disclosure"
      version="1.0"
      lastUpdated="06 February 2026"
      badge="REC: J26BSE087"
      sections={PULSE_SECTIONS}
    >
      <div style={{ background: 'rgba(191,255,0,0.05)', border: '1px solid rgba(191,255,0,0.2)', borderRadius: 12, padding: 20, marginBottom: 32 }}>
        <div style={{ fontFamily: 'Syne', fontWeight: 800, color: '#BFFF00', fontSize: 15, marginBottom: 8 }}>GDPR Article 22 — Automated Decision-Making Notice</div>
        <p style={{ color: '#aaa', fontSize: 14, lineHeight: 1.7 }}>
          PULSE constitutes automated profiling under GDPR Article 22 and Rwanda Law No. 058/2021.
          You have the right to request human review of any classification and to object to automated processing.
          This page explains exactly how PULSE works and what your rights are.
        </p>
      </div>

      <LegalSection id="what-is-pulse" title="What is PULSE?">
        <p>PULSE (Predictive Unified Learner State Engine) is an AI system built by FluentFusion. It analyses your learning behaviour and classifies you into one of five learner states:</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
          {[
            ['🚀 Thriving', '#2ecc71', 'High engagement and strong performance. You are excelling.'],
            ['😐 Coasting', '#3498db', 'Moderate engagement. You are doing fine but could be challenged more.'],
            ['😓 Struggling', '#e67e22', 'Low performance. You may benefit from extra support and simpler content.'],
            ['🔥 Burning Out', '#e74c3c', 'Declining activity. You may be at risk of disengaging.'],
            ['💤 Disengaged', '#95a5a6', 'Very low activity. You may need re-engagement support.'],
          ].map(([label, color, desc]) => (
            <div key={label} style={{ background: '#111', border: `1px solid ${color}33`, borderRadius: 8, padding: 12 }}>
              <div style={{ fontWeight: 700, color, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 13, color: '#888' }}>{desc}</div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 16 }}>PULSE uses a <strong style={{ color: '#fff' }}>GradientBoostingClassifier</strong> trained on the Open University Learning Analytics Dataset (OULAD) — 32,000 real students. This research was approved by the ALU Research Ethics Committee (REC Approval: J26BSE087, 06 February 2026).</p>
      </LegalSection>

      <LegalSection id="signals" title="Behavioural Signals Used by PULSE">
        <LegalTable
          headers={['Signal', 'What It Measures']}
          rows={[
            ['Total clicks', 'Overall engagement with course materials'],
            ['Active days', 'How many days you have been active on the platform'],
            ['Average clicks per day', 'Intensity of engagement on active days'],
            ['Assessment scores', 'Your performance on quizzes and assignments'],
            ['Number of assessments submitted', 'How many tasks you have completed'],
            ['Days to first submission', 'How quickly you engage with new material'],
            ['Previous attempts', 'Whether you have retaken courses before'],
            ['Studied credits', 'Your overall course load'],
            ['Registration timing', 'How early you registered before course start'],
            ['Early withdrawal signals', 'Whether you have withdrawn from courses early'],
          ]}
        />
      </LegalSection>

      <LegalSection id="how-used" title="How Classifications Are Used">
        <p>Your PULSE state is used to:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8, lineHeight: 2 }}>
          <li>Adjust the difficulty of your lessons and quizzes</li>
          <li>Recommend shorter or longer study sessions</li>
          <li>Suggest more or fewer flashcards per day</li>
          <li>Alert your instructor so they can offer targeted support</li>
          <li>Trigger motivational notifications at the right time</li>
        </ul>
        <p style={{ marginTop: 12 }}>Your state is visible to you on your dashboard and to your enrolled instructors in aggregated form.</p>
      </LegalSection>

      <LegalSection id="limits" title="What PULSE Does NOT Determine">
        <div style={{ background: 'rgba(255,68,68,0.05)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: 10, padding: 16 }}>
          <p style={{ color: '#FF6B6B', fontWeight: 700, marginBottom: 8 }}>Important Limitations</p>
          <ul style={{ paddingLeft: 20, lineHeight: 2, color: '#aaa' }}>
            <li>PULSE does <strong style={{ color: '#fff' }}>not</strong> determine your grades or certification</li>
            <li>PULSE does <strong style={{ color: '#fff' }}>not</strong> affect your account status or access to courses</li>
            <li>PULSE does <strong style={{ color: '#fff' }}>not</strong> make final decisions — all consequential decisions require human review</li>
            <li>PULSE classifications are <strong style={{ color: '#fff' }}>probabilistic estimates</strong>, not definitive assessments</li>
          </ul>
        </div>
      </LegalSection>

      <LegalSection id="your-rights" title="Your Rights Regarding PULSE">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            ['View your state', 'Your current PULSE state is always visible on your student dashboard.'],
            ['Submit a disagreement', 'If you believe your classification is wrong, click "I disagree" on your dashboard to submit feedback.'],
            ['Request human review', 'Submit a Data Subject Request of type "Objection" via your Data Rights Dashboard.'],
            ['Object to automated processing', 'You can opt out of PULSE classification entirely. This will disable adaptive curriculum features.'],
          ].map(([right, desc]) => (
            <div key={right} style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 8, padding: 14, display: 'flex', gap: 12 }}>
              <span style={{ color: '#BFFF00', fontSize: 18, flexShrink: 0 }}>→</span>
              <div>
                <div style={{ fontWeight: 700, color: '#fff', marginBottom: 4 }}>{right}</div>
                <div style={{ fontSize: 13, color: '#888' }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 16 }}>See also: <a href="/privacy#automated" style={{ color: '#BFFF00' }}>Privacy Policy — Automated Decisions</a></p>
      </LegalSection>

      <LegalSection id="contact" title="Contact About PULSE">
        <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 10, padding: 16 }}>
          <div style={{ color: '#BFFF00', fontWeight: 700, marginBottom: 8 }}>PULSE Enquiries</div>
          <div style={{ color: '#aaa', lineHeight: 2 }}>
            📧 <a href="mailto:pulse@fluentfusion.com" style={{ color: '#BFFF00' }}>pulse@fluentfusion.com</a><br />
            📧 Privacy: <a href="mailto:privacy@fluentfusion.com" style={{ color: '#BFFF00' }}>privacy@fluentfusion.com</a><br />
            📧 Research Ethics: <a href="mailto:researchethics@alueducation.com" style={{ color: '#BFFF00' }}>researchethics@alueducation.com</a>
          </div>
        </div>
      </LegalSection>
    </LegalLayout>
  )
}

// ── Children's Data Policy ────────────────────────────────────────────────

const CHILDREN_SECTIONS = [
  { id: 'minimum-age',     title: '1. Minimum Age' },
  { id: 'parental-consent', title: '2. Parental Consent' },
  { id: 'pulse-minors',    title: '3. PULSE for Minors' },
  { id: 'data-collected',  title: '4. Data Collected' },
  { id: 'parental-rights', title: '5. Parental Rights' },
  { id: 'contact',         title: '6. Contact' },
]

export function Children() {
  return (
    <LegalLayout
      title="Children's Data Policy"
      version="1.0"
      lastUpdated="06 February 2026"
      badge="GDPR Art. 8 + Law 058/2021"
      sections={CHILDREN_SECTIONS}
    >
      <LegalSection id="minimum-age" title="1. Minimum Age Requirement">
        <p>FluentFusion requires users to be at least <strong style={{ color: '#fff' }}>18 years old</strong> to create an account without parental consent.</p>
        <p style={{ marginTop: 12 }}>This requirement complies with:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8, lineHeight: 2 }}>
          <li>GDPR Article 8 (conditions applicable to child's consent)</li>
          <li>Rwanda Law No. 058/2021 on the Protection of Personal Data and Privacy</li>
        </ul>
        <p style={{ marginTop: 12 }}>If you are under 18, a parent or guardian must provide verifiable consent before your account is activated.</p>
      </LegalSection>

      <LegalSection id="parental-consent" title="2. Parental Consent Process">
        <p>When a user indicates they are under 18 during registration:</p>
        <ol style={{ paddingLeft: 20, marginTop: 8, lineHeight: 2 }}>
          <li>We ask for the parent or guardian's name and email address</li>
          <li>We send a consent request email to the guardian</li>
          <li>The guardian must click a confirmation link within <strong style={{ color: '#fff' }}>7 days</strong></li>
          <li>The account is not activated until the guardian confirms</li>
          <li>If the guardian does not confirm within 7 days, the account is automatically deleted</li>
        </ol>
        <p style={{ marginTop: 12 }}>Guardians can revoke consent at any time by contacting <a href="mailto:privacy@fluentfusion.com" style={{ color: '#BFFF00' }}>privacy@fluentfusion.com</a>.</p>
      </LegalSection>

      <LegalSection id="pulse-minors" title="3. PULSE Restrictions for Minor Accounts">
        <p>For users under 18, PULSE automated classification is <strong style={{ color: '#fff' }}>disabled by default</strong> until the parent or guardian provides explicit consent for data processing.</p>
        <p style={{ marginTop: 12 }}>This means:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8, lineHeight: 2 }}>
          <li>No behavioural telemetry is collected until consent is confirmed</li>
          <li>The adaptive curriculum features are not active</li>
          <li>Instructors cannot see PULSE state data for minor students</li>
        </ul>
        <p style={{ marginTop: 12 }}>Once parental consent for data processing is confirmed, PULSE operates under the same rules as for adult users, with the additional safeguard that data is retained for a maximum of 12 months.</p>
      </LegalSection>

      <LegalSection id="data-collected" title="4. What Data Is Collected from Minor Accounts">
        <p>For minor accounts with parental consent, we collect the same data as adult accounts, with these additional restrictions:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8, lineHeight: 2 }}>
          <li>No marketing communications are sent to minor accounts</li>
          <li>Behavioural data is retained for a maximum of 12 months</li>
          <li>No data is shared with third parties beyond strictly necessary sub-processors</li>
          <li>Live session recordings require separate parental consent</li>
        </ul>
      </LegalSection>

      <LegalSection id="parental-rights" title="5. Parental and Guardian Rights">
        <p>Parents and guardians of minor users have the right to:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8, lineHeight: 2 }}>
          <li><strong style={{ color: '#fff' }}>View</strong> all data held about their child</li>
          <li><strong style={{ color: '#fff' }}>Correct</strong> inaccurate information</li>
          <li><strong style={{ color: '#fff' }}>Delete</strong> their child's account and all associated data</li>
          <li><strong style={{ color: '#fff' }}>Restrict</strong> PULSE data processing</li>
          <li><strong style={{ color: '#fff' }}>Withdraw consent</strong> at any time</li>
        </ul>
        <p style={{ marginTop: 12 }}>To exercise these rights, contact <a href="mailto:privacy@fluentfusion.com" style={{ color: '#BFFF00' }}>privacy@fluentfusion.com</a> with proof of guardianship. We will respond within 30 days.</p>
      </LegalSection>

      <LegalSection id="contact" title="6. Contact">
        <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 10, padding: 16 }}>
          <div style={{ color: '#BFFF00', fontWeight: 700, marginBottom: 8 }}>Children's Data Enquiries</div>
          <div style={{ color: '#aaa', lineHeight: 2 }}>
            📧 <a href="mailto:privacy@fluentfusion.com" style={{ color: '#BFFF00' }}>privacy@fluentfusion.com</a><br />
            <span style={{ fontSize: 12, color: '#555' }}>Please include "Children's Data" in the subject line.</span>
          </div>
        </div>
      </LegalSection>
    </LegalLayout>
  )
}
