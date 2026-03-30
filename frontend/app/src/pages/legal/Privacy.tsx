import React from 'react'
import LegalLayout, { LegalSection, LegalTable } from './LegalLayout'

const SECTIONS = [
  { id: 'who-we-are',       title: '1. Who We Are' },
  { id: 'data-collected',   title: '2. Data We Collect' },
  { id: 'legal-basis',      title: '3. Legal Basis' },
  { id: 'automated',        title: '4. PULSE Automated Decisions' },
  { id: 'sharing',          title: '5. How We Share Data' },
  { id: 'transfers',        title: '6. Cross-Border Transfers' },
  { id: 'retention',        title: '7. Data Retention' },
  { id: 'rights',           title: '8. Your Rights' },
  { id: 'children',         title: '9. Children\'s Data' },
  { id: 'cookies',          title: '10. Cookies' },
  { id: 'exercise-rights',  title: '11. Exercise Your Rights' },
  { id: 'changes',          title: '12. Policy Changes' },
  { id: 'contact',          title: '13. Contact' },
]

export default function Privacy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      version="1.0"
      lastUpdated="06 February 2026"
      badge="GDPR + Law 058/2021"
      sections={SECTIONS}
    >
      <LegalSection id="who-we-are" title="1. Who We Are and Contact Details">
        <p>FluentFusion AI operates this language learning platform. We are the data controller for all personal data processed through the platform.</p>
        <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 10, padding: 16, marginTop: 12 }}>
          <div style={{ color: '#BFFF00', fontWeight: 700, marginBottom: 8 }}>Data Controller</div>
          <div style={{ color: '#aaa', lineHeight: 1.8 }}>
            FluentFusion AI<br />
            📧 <a href="mailto:privacy@fluentfusion.com" style={{ color: '#BFFF00' }}>privacy@fluentfusion.com</a><br />
            📧 Research Ethics: <a href="mailto:researchethics@alueducation.com" style={{ color: '#BFFF00' }}>researchethics@alueducation.com</a><br />
            <span style={{ fontSize: 12, color: '#555' }}>REC Approval: J26BSE087</span>
          </div>
        </div>
      </LegalSection>

      <LegalSection id="data-collected" title="2. What Data We Collect">
        <LegalTable
          headers={['Data Category', 'Source', 'Purpose']}
          rows={[
            ['Name, email, password (hashed)', 'You at registration', 'Account creation and login'],
            ['Date of birth', 'You at registration', 'Age verification and parental consent'],
            ['Learning behaviour (clicks, session duration, quiz scores)', 'Platform automatically', 'PULSE learner state classification'],
            ['Assessment scores and submission timing', 'Platform automatically', 'Progress tracking and PULSE signals'],
            ['Payment transaction data', 'Stripe', 'Billing and payout management'],
            ['Live session audio/video', 'LiveKit (with consent)', 'Educational review recordings'],
            ['IP address and device information', 'Browser automatically', 'Security and fraud prevention'],
            ['Course content uploaded by instructors', 'Instructors', 'Delivering courses to students'],
          ]}
        />
      </LegalSection>

      <LegalSection id="legal-basis" title="3. Legal Basis for Processing">
        <p>We process your data under the following legal bases, as required by GDPR Article 6 and Rwanda Law No. 058/2021:</p>
        <LegalTable
          headers={['Processing Activity', 'Legal Basis']}
          rows={[
            ['Account creation and login', 'Contract performance (Art. 6(1)(b))'],
            ['PULSE learner state classification', 'Legitimate interest + explicit consent (Art. 6(1)(a)(f))'],
            ['Payment processing', 'Contract performance (Art. 6(1)(b))'],
            ['Live session recording', 'Explicit consent (Art. 6(1)(a))'],
            ['Marketing communications', 'Consent (Art. 6(1)(a)) — optional'],
            ['Security and fraud prevention', 'Legitimate interest (Art. 6(1)(f))'],
          ]}
        />
      </LegalSection>

      <LegalSection id="automated" title="4. PULSE as an Automated Decision-Making System">
        <div style={{ background: 'rgba(191,255,0,0.05)', border: '1px solid rgba(191,255,0,0.15)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <div style={{ color: '#BFFF00', fontWeight: 700, marginBottom: 6 }}>GDPR Article 22 Notice</div>
          <p style={{ color: '#aaa', fontSize: 14 }}>PULSE constitutes automated profiling. You have the right to request human review of any classification.</p>
        </div>
        <p>PULSE analyses your learning behaviour to classify your learner state. This classification adapts your curriculum but does not determine your grades, certification, or account status.</p>
        <p style={{ marginTop: 12 }}>You can view your state, submit a disagreement, and request human review at any time from your dashboard. See <a href="/pulse-disclosure" style={{ color: '#BFFF00' }}>/pulse-disclosure</a> for full details.</p>
      </LegalSection>

      <LegalSection id="sharing" title="5. How We Share Your Data">
        <p>We do not sell your personal data. We share data only with the following sub-processors:</p>
        <LegalTable
          headers={['Sub-processor', 'Purpose', 'Location', 'Safeguards']}
          rows={[
            ['Stripe Inc.', 'Payment processing', 'USA', 'PCI-DSS Level 1, SCCs'],
            ['LiveKit', 'Live session video/audio', 'USA', 'Encrypted transport, SCCs'],
            ['AWS S3', 'Media file storage', 'Ireland (eu-west-1)', 'Server-side encryption, adequate protection'],
            ['SendGrid', 'Transactional email', 'USA', 'TLS encryption, SCCs'],
          ]}
        />
        <p style={{ marginTop: 12 }}>Instructors can see aggregated PULSE state data for their enrolled students. Admins can see all data for platform management purposes.</p>
      </LegalSection>

      <LegalSection id="transfers" title="6. Cross-Border Data Transfers">
        <p>Some of our sub-processors are based outside Rwanda and the EU. We ensure adequate protection through:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8, lineHeight: 2 }}>
          <li><strong style={{ color: '#fff' }}>AWS S3 (eu-west-1, Ireland):</strong> Covered by EU adequacy decision</li>
          <li><strong style={{ color: '#fff' }}>Stripe, LiveKit, SendGrid (USA):</strong> Standard Contractual Clauses (SCCs) under GDPR Article 46</li>
        </ul>
      </LegalSection>

      <LegalSection id="retention" title="7. Data Retention Schedule">
        <LegalTable
          headers={['Data Category', 'Retention Period', 'Reason']}
          rows={[
            ['Account data', 'Account lifetime + 2 years', 'Legal obligation and dispute resolution'],
            ['Session recordings', '30 days then permanently deleted', 'Educational review only'],
            ['PULSE behavioural logs', '12 months then anonymised', 'Model improvement and fairness audits'],
            ['Payment records', '7 years', 'Tax compliance (Rwandan law)'],
            ['Consent records', 'Indefinite', 'Legal evidence of consent'],
            ['Audit logs', '5 years', 'Security and compliance'],
          ]}
        />
      </LegalSection>

      <LegalSection id="rights" title="8. Your Rights">
        <p>Under GDPR and Rwanda Law No. 058/2021, you have the following rights:</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
          {[
            ['🔍 Access', 'Request a copy of all data we hold about you'],
            ['✏️ Rectification', 'Correct inaccurate or incomplete data'],
            ['🗑️ Erasure', 'Request deletion of your data ("right to be forgotten")'],
            ['📦 Portability', 'Receive your data in a machine-readable format'],
            ['⏸️ Restriction', 'Limit how we process your data'],
            ['🚫 Objection', 'Object to processing based on legitimate interest'],
            ['🤝 Human Review', 'Request human review of any PULSE AI classification'],
            ['📧 Withdraw Consent', 'Withdraw any consent you have given at any time'],
          ].map(([right, desc]) => (
            <div key={right} style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 8, padding: 12 }}>
              <div style={{ fontWeight: 700, color: '#fff', marginBottom: 4 }}>{right}</div>
              <div style={{ fontSize: 13, color: '#888' }}>{desc}</div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 16 }}>Exercise your rights via your <a href="/dashboard/data-rights" style={{ color: '#BFFF00' }}>Data Rights Dashboard</a> or by emailing <a href="mailto:privacy@fluentfusion.com" style={{ color: '#BFFF00' }}>privacy@fluentfusion.com</a>. We will respond within 30 days.</p>
      </LegalSection>

      <LegalSection id="children" title="9. Children's Data">
        <p>FluentFusion requires users to be at least 18 years old, or to have verifiable parental consent if under 18.</p>
        <p style={{ marginTop: 12 }}>For minor accounts, PULSE automated classification is disabled until parental consent for data processing is confirmed. See <a href="/children" style={{ color: '#BFFF00' }}>/children</a> for our full Children's Data Policy.</p>
        <p style={{ marginTop: 12 }}>Parents and guardians may request to view, correct, or delete their child's data at any time by contacting <a href="mailto:privacy@fluentfusion.com" style={{ color: '#BFFF00' }}>privacy@fluentfusion.com</a>.</p>
      </LegalSection>

      <LegalSection id="cookies" title="10. Cookie Policy">
        <p>We use strictly necessary cookies (no consent required) and optional analytics and preference cookies (consent required). See our full <a href="/cookies" style={{ color: '#BFFF00' }}>Cookie Policy</a> for details.</p>
      </LegalSection>

      <LegalSection id="exercise-rights" title="11. How to Exercise Your Rights">
        <p>The easiest way to exercise your rights is through your <a href="/dashboard/data-rights" style={{ color: '#BFFF00' }}>Data Rights Dashboard</a>, which allows you to:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8, lineHeight: 2 }}>
          <li>View and revoke your consents</li>
          <li>Submit data subject requests</li>
          <li>Download a copy of your data</li>
          <li>Request account deletion</li>
        </ul>
        <p style={{ marginTop: 12 }}>You can also email <a href="mailto:privacy@fluentfusion.com" style={{ color: '#BFFF00' }}>privacy@fluentfusion.com</a>. We will respond within 30 days as required by law.</p>
      </LegalSection>

      <LegalSection id="changes" title="12. Changes to This Policy">
        <LegalTable
          headers={['Version', 'Date', 'Summary of Changes']}
          rows={[
            ['1.0', '06 February 2026', 'Initial version — REC approved'],
          ]}
        />
        <p>We will notify you by email and in-platform notification of any material changes, with at least 30 days notice.</p>
      </LegalSection>

      <LegalSection id="contact" title="13. Contact">
        <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 10, padding: 16 }}>
          <div style={{ color: '#BFFF00', fontWeight: 700, marginBottom: 8 }}>Privacy Contact</div>
          <div style={{ color: '#aaa', lineHeight: 2 }}>
            📧 <a href="mailto:privacy@fluentfusion.com" style={{ color: '#BFFF00' }}>privacy@fluentfusion.com</a><br />
            📧 Research Ethics: <a href="mailto:researchethics@alueducation.com" style={{ color: '#BFFF00' }}>researchethics@alueducation.com</a>
          </div>
        </div>
      </LegalSection>
    </LegalLayout>
  )
}
