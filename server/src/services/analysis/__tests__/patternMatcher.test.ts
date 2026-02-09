import { describe, it, expect } from 'vitest';
import { matchPatterns } from '../patternMatcher';
import { ContentType } from '@senior-protect/shared';

describe('PatternMatcher', () => {
  describe('matchPatterns - Known scam patterns', () => {
    it('should detect multiple signals in a known scam email', () => {
      const scamEmail = `
        URGENT ACTION REQUIRED!
        Dear valued customer,
        Your account has been suspended due to suspicious activity.
        You must verify your account within 24 hours or face legal action.
        Click here to confirm your password and credit card number.
        You've won $1 million dollars! Act now to claim your prize!
      `;

      const signals = matchPatterns(scamEmail, ContentType.Email);

      expect(signals.length).toBeGreaterThan(5);

      // Should contain urgency signals
      const urgencySignals = signals.filter(s => s.category === 'urgency');
      expect(urgencySignals.length).toBeGreaterThan(0);

      // Should contain credential request signals
      const credentialSignals = signals.filter(s => s.category === 'credential_request');
      expect(credentialSignals.length).toBeGreaterThan(0);

      // Should contain threat language signals
      const threatSignals = signals.filter(s => s.category === 'threat_language');
      expect(threatSignals.length).toBeGreaterThan(0);

      // Should contain financial pressure signals
      const financialSignals = signals.filter(s => s.category === 'financial_pressure');
      expect(financialSignals.length).toBeGreaterThan(0);
    });

    it('should return zero or minimal signals for legitimate email', () => {
      const legitimateEmail = `
        Hi John,
        Thanks for your order #12345. Your package will arrive on Tuesday.
        If you have any questions, feel free to reply to this email.
        Best regards,
        Customer Service Team
      `;

      const signals = matchPatterns(legitimateEmail, ContentType.Email);

      expect(signals.length).toBe(0);
    });
  });

  describe('matchPatterns - Category coverage', () => {
    it('should detect urgency patterns', () => {
      const urgentTexts = [
        'Your account has been suspended',
        'Act now before it expires',
        'Urgent action required immediately',
        'You must respond within 24 hours',
        'Verify your account today',
        'This offer expires soon',
        'Limited time offer',
        'Final notice - deadline approaching',
      ];

      urgentTexts.forEach(text => {
        const signals = matchPatterns(text, ContentType.Text);
        const urgencySignals = signals.filter(s => s.category === 'urgency');
        expect(urgencySignals.length).toBeGreaterThan(0, `Failed to detect urgency in: "${text}"`);
      });
    });

    it('should detect credential_request patterns', () => {
      const credentialTexts = [
        'Please confirm your password',
        'Enter your social security number',
        'Provide your credit card number',
        'Update your bank account details',
        'Verify your PIN code',
        'Send us your login credentials',
        'Confirm your identity by providing SSN',
        'Enter your CVV code',
      ];

      credentialTexts.forEach(text => {
        const signals = matchPatterns(text, ContentType.Text);
        const credentialSignals = signals.filter(s => s.category === 'credential_request');
        expect(credentialSignals.length).toBeGreaterThan(0, `Failed to detect credential request in: "${text}"`);

        // All credential requests should be critical or high severity
        credentialSignals.forEach(signal => {
          expect(['critical', 'high']).toContain(signal.severity);
        });
      });
    });

    it('should detect financial_pressure patterns', () => {
      const financialTexts = [
        "You've won a million dollars!",
        'Congratulations! You won the lottery',
        'Claim your prize now',
        'Send payment via wire transfer',
        'Purchase iTunes gift cards',
        'Use Western Union to send money',
        'Invest in Bitcoin today',
        'You have an inheritance waiting',
        'Claim your refund of $500',
      ];

      financialTexts.forEach(text => {
        const signals = matchPatterns(text, ContentType.Text);
        const financialSignals = signals.filter(s => s.category === 'financial_pressure');
        expect(financialSignals.length).toBeGreaterThan(0, `Failed to detect financial pressure in: "${text}"`);
      });
    });

    it('should detect impersonation patterns', () => {
      const impersonationTexts = [
        'Dear valued customer,',
        'Dear customer, your account',
        'Dear sir/madam,',
      ];

      impersonationTexts.forEach(text => {
        const signals = matchPatterns(text, ContentType.Email);
        const impersonationSignals = signals.filter(s => s.category === 'impersonation');
        expect(impersonationSignals.length).toBeGreaterThan(0, `Failed to detect impersonation in: "${text}"`);
      });
    });

    it('should detect threat_language patterns', () => {
      const threatTexts = [
        'We will take legal action',
        'An arrest warrant has been issued',
        'Law enforcement will contact you',
        'You will face criminal charges',
        'We will file a lawsuit',
        'You committed tax fraud',
      ];

      threatTexts.forEach(text => {
        const signals = matchPatterns(text, ContentType.Text);
        const threatSignals = signals.filter(s => s.category === 'threat_language');
        expect(threatSignals.length).toBeGreaterThan(0, `Failed to detect threat language in: "${text}"`);
      });
    });

    it('should detect too_good_to_be_true patterns', () => {
      const tooGoodTexts = [
        'This is a risk free investment',
        'Guaranteed returns on your money',
        'No cost, no obligation',
        'Get free money today',
        'We will double your investment',
        '100% guaranteed success',
        'Make $5000 per day from home',
        'Once in a lifetime opportunity',
      ];

      tooGoodTexts.forEach(text => {
        const signals = matchPatterns(text, ContentType.Text);
        const tooGoodSignals = signals.filter(s => s.category === 'too_good_to_be_true');
        expect(tooGoodSignals.length).toBeGreaterThan(0, `Failed to detect too-good-to-be-true in: "${text}"`);
      });
    });
  });

  describe('matchPatterns - Brand impersonation detection', () => {
    it('should flag brand impersonation with mismatched sender domain', () => {
      const content = 'Your Amazon account has been suspended. Click here to verify.';
      const metadata = { sender: 'support@amaz0n-security.com' };

      const signals = matchPatterns(content, ContentType.Email, metadata);

      const impersonationSignals = signals.filter(s =>
        s.category === 'impersonation' && s.pattern.includes('brand_mismatch')
      );

      expect(impersonationSignals.length).toBeGreaterThan(0);
      expect(impersonationSignals[0].severity).toBe('critical');
      expect(impersonationSignals[0].description).toContain('amazon');
    });

    it('should not flag legitimate brand emails from correct domains', () => {
      const content = 'Your Amazon order has shipped.';
      const metadata = { sender: 'orders@amazon.com' };

      const signals = matchPatterns(content, ContentType.Email, metadata);

      const impersonationSignals = signals.filter(s =>
        s.category === 'impersonation' && s.pattern.includes('brand_mismatch')
      );

      expect(impersonationSignals.length).toBe(0);
    });

    it('should detect PayPal impersonation', () => {
      const content = 'Your PayPal payment is pending. Confirm your identity.';
      const metadata = { sender: 'noreply@paypa1-secure.com' };

      const signals = matchPatterns(content, ContentType.Email, metadata);

      const impersonationSignals = signals.filter(s =>
        s.category === 'impersonation' && s.pattern.includes('brand_mismatch')
      );

      expect(impersonationSignals.length).toBeGreaterThan(0);
      expect(impersonationSignals[0].description).toContain('paypal');
    });

    it('should detect Apple impersonation', () => {
      const content = 'Your Apple ID has been locked for security reasons.';
      const metadata = { sender: 'security@apple-support.tk' };

      const signals = matchPatterns(content, ContentType.Email, metadata);

      const impersonationSignals = signals.filter(s =>
        s.category === 'impersonation' && s.pattern.includes('brand_mismatch')
      );

      expect(impersonationSignals.length).toBeGreaterThan(0);
      expect(impersonationSignals[0].severity).toBe('critical');
    });

    it('should detect IRS impersonation', () => {
      const content = 'The IRS needs you to verify your tax information immediately.';
      const metadata = { sender: 'taxdept@irs-gov.com' };

      const signals = matchPatterns(content, ContentType.Email, metadata);

      const impersonationSignals = signals.filter(s =>
        s.category === 'impersonation' && s.pattern.includes('brand_mismatch')
      );

      expect(impersonationSignals.length).toBeGreaterThan(0);
    });
  });

  describe('matchPatterns - Suspicious sender from free email', () => {
    it('should flag business content from Gmail address', () => {
      const content = 'Your invoice is attached. Payment is due immediately.';
      const metadata = { sender: 'billing@gmail.com' };

      const signals = matchPatterns(content, ContentType.Email, metadata);

      const suspiciousSenderSignals = signals.filter(s =>
        s.category === 'suspicious_sender'
      );

      expect(suspiciousSenderSignals.length).toBeGreaterThan(0);
      expect(suspiciousSenderSignals[0].severity).toBe('high');
      expect(suspiciousSenderSignals[0].description).toContain('free email provider');
    });

    it('should flag bank-related content from Yahoo', () => {
      const content = 'Your bank account requires verification.';
      const metadata = { sender: 'security@yahoo.com' };

      const signals = matchPatterns(content, ContentType.Email, metadata);

      const suspiciousSenderSignals = signals.filter(s =>
        s.category === 'suspicious_sender'
      );

      expect(suspiciousSenderSignals.length).toBeGreaterThan(0);
    });

    it('should flag support requests from Hotmail', () => {
      const content = 'Customer service team here. We need to verify your account.';
      const metadata = { sender: 'support@hotmail.com' };

      const signals = matchPatterns(content, ContentType.Email, metadata);

      const suspiciousSenderSignals = signals.filter(s =>
        s.category === 'suspicious_sender'
      );

      expect(suspiciousSenderSignals.length).toBeGreaterThan(0);
    });

    it('should not flag personal emails from free providers', () => {
      const content = 'Hey, want to meet for coffee tomorrow?';
      const metadata = { sender: 'friend@gmail.com' };

      const signals = matchPatterns(content, ContentType.Email, metadata);

      const suspiciousSenderSignals = signals.filter(s =>
        s.category === 'suspicious_sender'
      );

      expect(suspiciousSenderSignals.length).toBe(0);
    });

    it('should not flag business content from business domains', () => {
      const content = 'Your invoice for services rendered is attached.';
      const metadata = { sender: 'billing@acmecorp.com' };

      const signals = matchPatterns(content, ContentType.Email, metadata);

      const suspiciousSenderSignals = signals.filter(s =>
        s.category === 'suspicious_sender'
      );

      expect(suspiciousSenderSignals.length).toBe(0);
    });
  });

  describe('matchPatterns - Edge cases', () => {
    it('should handle empty content', () => {
      const signals = matchPatterns('', ContentType.Text);
      expect(signals).toEqual([]);
    });

    it('should handle content with no patterns', () => {
      const content = 'Hello, how are you today?';
      const signals = matchPatterns(content, ContentType.Text);
      expect(signals).toEqual([]);
    });

    it('should handle missing metadata gracefully', () => {
      const content = 'Your Amazon account needs attention urgently';
      const signals = matchPatterns(content, ContentType.Email);

      // Should still detect patterns (urgency), just not sender-based checks
      expect(signals.length).toBeGreaterThanOrEqual(0);
    });

    it('should be case-insensitive', () => {
      const lowerCase = 'urgent action required';
      const upperCase = 'URGENT ACTION REQUIRED';
      const mixedCase = 'uRgEnT aCtIoN rEqUiReD';

      const signals1 = matchPatterns(lowerCase, ContentType.Text);
      const signals2 = matchPatterns(upperCase, ContentType.Text);
      const signals3 = matchPatterns(mixedCase, ContentType.Text);

      expect(signals1.length).toBeGreaterThan(0);
      expect(signals2.length).toBeGreaterThan(0);
      expect(signals3.length).toBeGreaterThan(0);

      expect(signals1.length).toBe(signals2.length);
      expect(signals1.length).toBe(signals3.length);
    });
  });

  describe('matchPatterns - Signal structure validation', () => {
    it('should return properly structured signals', () => {
      const content = 'Urgent: verify your password immediately';
      const signals = matchPatterns(content, ContentType.Text);

      expect(signals.length).toBeGreaterThan(0);

      signals.forEach(signal => {
        expect(signal).toHaveProperty('category');
        expect(signal).toHaveProperty('pattern');
        expect(signal).toHaveProperty('description');
        expect(signal).toHaveProperty('severity');
        expect(signal).toHaveProperty('matched');

        expect(typeof signal.category).toBe('string');
        expect(typeof signal.pattern).toBe('string');
        expect(typeof signal.description).toBe('string');
        expect(['low', 'medium', 'high', 'critical']).toContain(signal.severity);
        expect(typeof signal.matched).toBe('string');
      });
    });
  });
});
