import React from 'react'
import LegalLayout, { LegalSection, LegalTable } from './LegalLayout'

const SECTIONS = [
  { id: 'acceptance',    title: '1. Acceptance of Terms' },
  { id: 'accounts',      title: '2. Accounts & Eligibility' },
  { id: 'conduct',       title: '3. Permitted Use' },
  { id: 'payments',      title: '4. Payments & Refunds' },
  { id: 'ip',            title: '5. Intellectual Property' },
  { id: 'pulse',         title: '6. PULSE AI Disclosure' },
  { id: 'recording',     title: '7. Live Session Recording' },
  { id: 'third-party',   title: '8. Third-Party Services' },
  { id: 'liability',     title: '9. Limitation of Liability' },
  { id: 'governing-law', title: '10. Governing Law' },
  { id: 'changes',       title: '11. Changes to Terms' },
  { id: 'contact',       title: '12. Contact' },
]

export default function Terms() {
  return (
    <LegalLayout
      title="Terms and Conditions"
      version="1.0"
      lastUpdated="06 February 2026"
      badge="REC: J26BSE087"
      sections={SECTIONS}
    >
      <LegalSection id="acceptance" title="1. Acceptance of Terms">
        <p>By creating an account or using FluentFusion, you agree to these Terms and Conditions. If you do not agree, please do not use the platform.</p>
        <p style={{ marginTop: 12 }}>These Terms form a binding contract between you and FluentFusion AI. They apply to all users — students, instructors, and administrators.</p>
        <p style={{ marginTop: 12 }}>Using the platform after any update to these Terms means you accept the updated version.</p>
      </LegalSection>

      <LegalSection id="accounts" title="2. User Accounts and Eligibility">
        <p><strong style={{ color: '#fff' }}>Minimum age:</strong> You must be at least 18 years old to create an account. If you are under 18, a parent or guardian must provide verifiable consent before your account is activated.</p>
        <p style={{ marginTop: 12 }}><strong style={{ color: '#fff' }}>Account security:</strong> You are responsible for keeping your login credentials secure. Do not share your account with anyone. You must notify us immediately at <a href="mailto:legal@fluentfusion.com" style={{ color: '#BFFF00' }}>legal@fluentfusion.com</a> if you suspect unauthorised access.</p>
        <p style={{ marginTop: 12 }}><strong style={{ color: '#fff' }}>Accurate information:</strong> You must provide accurate information when registering. Accounts created with false information may be suspended.</p>
      </LegalSection>

      <LegalSection id="conduct" title="3. Permitted Use and Prohibited Conduct">
        <p>You may use FluentFusion for personal language learning and, if you are an instructor, for creating and delivering educational content.</p>
        <p style={{ marginTop: 12 }}>You must <strong style={{ color: '#fff' }}>not</strong>:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8, lineHeight: 2 }}>
          <li>Scrape, copy, or redistribute platform content without permission</li>
          <li>Impersonate other users, instructors, or FluentFusion staff</li>
          <li>Abuse the PULSE feedback mechanism to manipulate AI classifications</li>
          <li>Attempt to reverse-engineer the PULSE model or any platform code</li>
          <li>Upload harmful, illegal, or misleading content</li>
          <li>Use the platform for any commercial purpose not authorised by FluentFusion</li>
        </ul>
        <p style={{ marginTop: 12 }}>Violations may result in account suspension or permanent ban.</p>
      </LegalSection>

      <LegalSection id="payments" title="4. Subscription, Payments, and Refunds">
        <p><strong style={{ color: '#fff' }}>Payment processing:</strong> All payments are processed securely by Stripe. FluentFusion does not store your card details.</p>
        <p style={{ marginTop: 12 }}><strong style={{ color: '#fff' }}>Subscriptions:</strong> Paid subscriptions renew automatically at the end of each billing period. You can cancel at any time from your account settings.</p>
        <p style={{ marginTop: 12 }}><strong style={{ color: '#fff' }}>Refunds:</strong> You may request a full refund within 14 days of purchase, provided you have not completed more than 20% of the course. To request a refund, contact <a href="mailto:legal@fluentfusion.com" style={{ color: '#BFFF00' }}>legal@fluentfusion.com</a>.</p>
        <p style={{ marginTop: 12 }}><strong style={{ color: '#fff' }}>Instructor payouts:</strong> Instructors receive 80% of course revenue. Payouts are processed within 30 days of request, subject to minimum balance requirements.</p>
      </LegalSection>

      <LegalSection id="ip" title="5. Intellectual Property">
        <p>All platform code, design, branding, and original content belong to FluentFusion AI and are protected by copyright law.</p>
        <p style={{ marginTop: 12 }}><strong style={{ color: '#fff' }}>Instructor content:</strong> By uploading course content, you grant FluentFusion a non-exclusive, worldwide, royalty-free licence to host, display, and deliver that content to enrolled students. You retain ownership of your content.</p>
        <p style={{ marginTop: 12 }}><strong style={{ color: '#fff' }}>Student content:</strong> Any notes, quiz answers, or forum posts you create remain yours. You grant FluentFusion a limited licence to store and display them within the platform.</p>
      </LegalSection>

      <LegalSection id="pulse" title="6. PULSE Automated Processing Disclosure">
        <div style={{ background: 'rgba(191,255,0,0.05)', border: '1px solid rgba(191,255,0,0.15)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <div style={{ color: '#BFFF00', fontWeight: 700, marginBottom: 6 }}>⚠️ Important: Automated Profiling Notice</div>
          <p style={{ color: '#aaa', fontSize: 14 }}>FluentFusion uses PULSE, an AI system that analyses your learning behaviour. This constitutes automated profiling under GDPR Article 22.</p>
        </div>
        <p>PULSE classifies your learner state into one of five categories: Thriving, Coasting, Struggling, Burning Out, or Disengaged. This classification is used to adapt your curriculum — it does not affect your grades, certification, or account status.</p>
        <p style={{ marginTop: 12 }}><strong style={{ color: '#fff' }}>Your rights regarding PULSE:</strong></p>
        <ul style={{ paddingLeft: 20, marginTop: 8, lineHeight: 2 }}>
          <li>View your current classification on your dashboard</li>
          <li>Submit a disagreement if you believe the classification is wrong</li>
          <li>Request human review of any classification</li>
          <li>Object to automated processing entirely via your Data Rights Dashboard</li>
        </ul>
        <p style={{ marginTop: 12 }}>See <a href="/pulse-disclosure" style={{ color: '#BFFF00' }}>/pulse-disclosure</a> for full technical details.</p>
      </LegalSection>

      <LegalSection id="recording" title="7. Live Session Recording">
        <p>Live sessions may be recorded for educational review purposes. Recording requires your <strong style={{ color: '#fff' }}>separate, explicit consent</strong> before each session.</p>
        <p style={{ marginTop: 12 }}>If you consent to recording:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8, lineHeight: 2 }}>
          <li>The recording is stored for <strong style={{ color: '#fff' }}>30 days</strong> then permanently deleted</li>
          <li>Only enrolled students and the instructor can access the recording</li>
          <li>You can request earlier deletion at any time via your Data Rights Dashboard</li>
        </ul>
        <p style={{ marginTop: 12 }}>If you decline recording, you can still join the session. The instructor will be notified that you have declined.</p>
      </LegalSection>

      <LegalSection id="third-party" title="8. Third-Party Services">
        <p>FluentFusion uses the following sub-processors to deliver the service:</p>
        <LegalTable
          headers={['Service', 'Provider', 'Purpose', 'Data Shared']}
          rows={[
            ['Payments', 'Stripe Inc.', 'Payment processing', 'Transaction data'],
            ['Live Sessions', 'LiveKit', 'Real-time video/audio', 'Session audio/video'],
            ['Media Storage', 'AWS S3 (eu-west-1)', 'Course content hosting', 'Uploaded files'],
            ['Email', 'SendGrid', 'Transactional emails', 'Email address, name'],
          ]}
        />
        <p>Each sub-processor is bound by a Data Processing Agreement and complies with GDPR requirements.</p>
      </LegalSection>

      <LegalSection id="liability" title="9. Limitation of Liability">
        <p>FluentFusion is liable for:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8, lineHeight: 2 }}>
          <li>Data breaches caused by our negligence</li>
          <li>Service quality failures under Rwandan consumer protection law</li>
          <li>Incorrect processing of your personal data</li>
        </ul>
        <p style={{ marginTop: 12 }}>FluentFusion is <strong style={{ color: '#fff' }}>not</strong> liable for indirect losses, loss of earnings, or losses caused by third-party service outages beyond our control.</p>
        <p style={{ marginTop: 12 }}>Our total liability to you in any 12-month period is limited to the amount you paid to FluentFusion in that period.</p>
      </LegalSection>

      <LegalSection id="governing-law" title="10. Governing Law">
        <p>These Terms are governed by the laws of the <strong style={{ color: '#fff' }}>Republic of Rwanda</strong>, including Rwanda Law No. 058/2021 on the Protection of Personal Data and Privacy.</p>
        <p style={{ marginTop: 12 }}>Any disputes will be resolved under Rwandan jurisdiction. Where applicable, EU GDPR standards also apply to users in the European Economic Area.</p>
      </LegalSection>

      <LegalSection id="changes" title="11. Changes to Terms">
        <p>We will give you at least <strong style={{ color: '#fff' }}>30 days notice</strong> of any material changes to these Terms via email and an in-platform notification.</p>
        <p style={{ marginTop: 12 }}>Continued use of FluentFusion after the notice period constitutes acceptance of the updated Terms. If you do not accept the changes, you may close your account before the effective date.</p>
      </LegalSection>

      <LegalSection id="contact" title="12. Contact">
        <p>For legal enquiries regarding these Terms:</p>
        <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 10, padding: 16, marginTop: 12 }}>
          <div style={{ color: '#BFFF00', fontWeight: 700, marginBottom: 4 }}>FluentFusion AI — Legal</div>
          <div style={{ color: '#aaa' }}>📧 <a href="mailto:legal@fluentfusion.com" style={{ color: '#BFFF00' }}>legal@fluentfusion.com</a></div>
          <div style={{ color: '#aaa', marginTop: 4 }}>📧 Research Ethics: <a href="mailto:researchethics@alueducation.com" style={{ color: '#BFFF00' }}>researchethics@alueducation.com</a></div>
          <div style={{ color: '#555', fontSize: 12, marginTop: 8 }}>REC Approval: J26BSE087 — African Leadership University, 06 February 2026</div>
        </div>
      </LegalSection>
    </LegalLayout>
  )
}
