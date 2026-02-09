import { describe, it, expect } from 'vitest';
import { analyzeUrlStructure, checkTyposquatting } from '../urlAnalyzer';

describe('URLAnalyzer', () => {
  describe('analyzeUrlStructure', () => {
    it('should detect IP address hostname', () => {
      const url = 'http://192.168.1.1/login';
      const signals = analyzeUrlStructure(url);

      const ipSignals = signals.filter(s => s.pattern === 'ip-address-hostname');
      expect(ipSignals.length).toBe(1);
      expect(ipSignals[0].severity).toBe('high');
      expect(ipSignals[0].matched).toBe('192.168.1.1');
      expect(ipSignals[0].description).toContain('IP address');
    });

    it('should detect suspicious TLD (.tk)', () => {
      const url = 'https://suspicious-site.tk/login';
      const signals = analyzeUrlStructure(url);

      const tldSignals = signals.filter(s => s.pattern === 'suspicious-tld');
      expect(tldSignals.length).toBe(1);
      expect(tldSignals[0].severity).toBe('high');
      expect(tldSignals[0].matched).toBe('.tk');
    });

    it('should detect suspicious TLD (.xyz)', () => {
      const url = 'https://fake-bank.xyz';
      const signals = analyzeUrlStructure(url);

      const tldSignals = signals.filter(s => s.pattern === 'suspicious-tld');
      expect(tldSignals.length).toBe(1);
      expect(tldSignals[0].matched).toBe('.xyz');
    });

    it('should detect URL shortener (bit.ly)', () => {
      const url = 'https://bit.ly/abc123';
      const signals = analyzeUrlStructure(url);

      const shortenerSignals = signals.filter(s => s.pattern === 'url-shortener');
      expect(shortenerSignals.length).toBe(1);
      expect(shortenerSignals[0].severity).toBe('medium');
      expect(shortenerSignals[0].matched).toBe('bit.ly');
      expect(shortenerSignals[0].description).toContain('hide the real destination');
    });

    it('should detect URL shortener (tinyurl.com)', () => {
      const url = 'https://tinyurl.com/xyz789';
      const signals = analyzeUrlStructure(url);

      const shortenerSignals = signals.filter(s => s.pattern === 'url-shortener');
      expect(shortenerSignals.length).toBe(1);
      expect(shortenerSignals[0].matched).toBe('tinyurl.com');
    });

    it('should detect non-HTTPS URL', () => {
      const url = 'http://example.com/login';
      const signals = analyzeUrlStructure(url);

      const httpsSignals = signals.filter(s => s.pattern === 'non-https');
      expect(httpsSignals.length).toBe(1);
      expect(httpsSignals[0].severity).toBe('medium');
      expect(httpsSignals[0].matched).toBe('http:');
      expect(httpsSignals[0].description).toContain('secure HTTPS');
    });

    it('should detect excessive subdomains', () => {
      const url = 'https://login.secure.verify.account.fake-bank.com';
      const signals = analyzeUrlStructure(url);

      const subdomainSignals = signals.filter(s => s.pattern === 'excessive-subdomains');
      expect(subdomainSignals.length).toBe(1);
      expect(subdomainSignals[0].severity).toBe('medium');
      expect(subdomainSignals[0].description).toContain('unusual number of subdomains');
    });

    it('should detect @ sign in URL', () => {
      const url = 'https://trusted-site.com@malicious.com/login';
      const signals = analyzeUrlStructure(url);

      const atSignSignals = signals.filter(s => s.pattern === 'at-sign-trick');
      expect(atSignSignals.length).toBe(1);
      expect(atSignSignals[0].severity).toBe('critical');
      expect(atSignSignals[0].description).toContain('@ sign');
    });

    it('should not flag normal safe URL (https://google.com)', () => {
      const url = 'https://google.com';
      const signals = analyzeUrlStructure(url);

      // Should have no critical signals, might have low severity ones
      const criticalSignals = signals.filter(s =>
        s.severity === 'critical' || s.severity === 'high'
      );
      expect(criticalSignals.length).toBe(0);
    });

    it('should not flag normal safe URL (https://amazon.com)', () => {
      const url = 'https://amazon.com/product/123';
      const signals = analyzeUrlStructure(url);

      const criticalSignals = signals.filter(s =>
        s.severity === 'critical' || s.severity === 'high'
      );
      expect(criticalSignals.length).toBe(0);
    });

    it('should detect long URLs', () => {
      const longUrl = 'https://example.com/' + 'a'.repeat(150);
      const signals = analyzeUrlStructure(longUrl);

      const longUrlSignals = signals.filter(s => s.pattern === 'long-url');
      expect(longUrlSignals.length).toBe(1);
      expect(longUrlSignals[0].severity).toBe('low');
      expect(longUrlSignals[0].description).toContain('unusually long');
    });

    it('should detect double slashes in path', () => {
      const url = 'https://example.com//admin//login';
      const signals = analyzeUrlStructure(url);

      const doubleSlashSignals = signals.filter(s => s.pattern === 'double-slashes');
      expect(doubleSlashSignals.length).toBe(1);
      expect(doubleSlashSignals[0].severity).toBe('medium');
    });

    it('should detect suspicious port numbers', () => {
      const url = 'https://example.com:8080/login';
      const signals = analyzeUrlStructure(url);

      const portSignals = signals.filter(s => s.pattern === 'suspicious-port');
      expect(portSignals.length).toBe(1);
      expect(portSignals[0].matched).toBe('8080');
    });

    it('should not flag standard HTTPS port (443)', () => {
      const url = 'https://example.com:443/';
      const signals = analyzeUrlStructure(url);

      const portSignals = signals.filter(s => s.pattern === 'suspicious-port');
      expect(portSignals.length).toBe(0);
    });

    it('should detect suspicious encoded characters', () => {
      const url = 'https://example.com/%2e%2e/admin';
      const signals = analyzeUrlStructure(url);

      const encodingSignals = signals.filter(s => s.pattern === 'suspicious-encoding');
      expect(encodingSignals.length).toBe(1);
      expect(encodingSignals[0].severity).toBe('high');
    });

    it('should handle invalid URL gracefully', () => {
      const url = 'not-a-valid-url';
      const signals = analyzeUrlStructure(url);

      // Should attempt to parse and may return an invalid-url signal or parse it
      expect(Array.isArray(signals)).toBe(true);
    });

    it('should detect multiple issues in a malicious URL', () => {
      const url = 'http://192.168.1.1:8080/login?redirect=https://trusted.com@evil.tk';
      const signals = analyzeUrlStructure(url);

      expect(signals.length).toBeGreaterThan(2);

      // Should have IP address signal
      const ipSignals = signals.filter(s => s.pattern === 'ip-address-hostname');
      expect(ipSignals.length).toBeGreaterThan(0);

      // Should have non-HTTPS signal
      const httpsSignals = signals.filter(s => s.pattern === 'non-https');
      expect(httpsSignals.length).toBeGreaterThan(0);

      // Should have suspicious port signal
      const portSignals = signals.filter(s => s.pattern === 'suspicious-port');
      expect(portSignals.length).toBeGreaterThan(0);
    });
  });

  describe('checkTyposquatting', () => {
    it('should return no signals for exact domain match (amazon.com)', () => {
      const signals = checkTyposquatting('amazon.com');
      expect(signals.length).toBe(0);
    });

    it('should return no signals for exact domain match (paypal.com)', () => {
      const signals = checkTyposquatting('paypal.com');
      expect(signals.length).toBe(0);
    });

    it('should flag close misspelling (amazom.com)', () => {
      const signals = checkTyposquatting('amazom.com');

      expect(signals.length).toBeGreaterThan(0);
      expect(signals[0].category).toBe('typosquatting');
      expect(signals[0].severity).toBe('critical');
      expect(signals[0].description).toContain('amazon.com');
      expect(signals[0].description).toContain('typosquatting');
    });

    it('should flag close misspelling (paypa1.com)', () => {
      const signals = checkTyposquatting('paypa1.com');

      expect(signals.length).toBeGreaterThan(0);
      expect(signals[0].severity).toBe('critical');
      expect(signals[0].description).toContain('paypal.com');
    });

    it('should flag amaz0n.com as typosquatting', () => {
      const signals = checkTyposquatting('amaz0n.com');

      expect(signals.length).toBeGreaterThan(0);
      expect(signals[0].description).toContain('amazon.com');
    });

    it('should flag gogle.com as typosquatting', () => {
      const signals = checkTyposquatting('gogle.com');

      expect(signals.length).toBeGreaterThan(0);
      expect(signals[0].description).toContain('google.com');
    });

    it('should flag chase1.com as typosquatting', () => {
      const signals = checkTyposquatting('chase1.com');

      expect(signals.length).toBeGreaterThan(0);
      expect(signals[0].description).toContain('chase.com');
    });

    it('should return no signals for completely different domain', () => {
      const signals = checkTyposquatting('totallydifferent.com');
      expect(signals.length).toBe(0);
    });

    it('should return no signals for random domain', () => {
      const signals = checkTyposquatting('xyz123abc.com');
      expect(signals.length).toBe(0);
    });

    it('should handle domain with protocol', () => {
      const signals = checkTyposquatting('https://amazom.com');

      expect(signals.length).toBeGreaterThan(0);
      expect(signals[0].description).toContain('amazon.com');
    });

    it('should handle domain with www prefix', () => {
      const signals = checkTyposquatting('www.paypa1.com');

      expect(signals.length).toBeGreaterThan(0);
      expect(signals[0].description).toContain('paypal.com');
    });

    it('should handle domain with path', () => {
      const signals = checkTyposquatting('amazom.com/login');

      expect(signals.length).toBeGreaterThan(0);
      expect(signals[0].description).toContain('amazon.com');
    });

    it('should handle domain with query string', () => {
      const signals = checkTyposquatting('paypa1.com?redirect=evil');

      expect(signals.length).toBeGreaterThan(0);
      expect(signals[0].description).toContain('paypal.com');
    });

    it('should be case-insensitive', () => {
      const signals1 = checkTyposquatting('AMAZOM.COM');
      const signals2 = checkTyposquatting('amazom.com');
      const signals3 = checkTyposquatting('AmaZoM.CoM');

      expect(signals1.length).toBeGreaterThan(0);
      expect(signals2.length).toBeGreaterThan(0);
      expect(signals3.length).toBeGreaterThan(0);
    });

    it('should detect typosquatting for government domains', () => {
      const signals = checkTyposquatting('ir.gov');

      // Should detect it's close to irs.gov (1 character difference)
      expect(signals.length).toBeGreaterThan(0);
      expect(signals[0].description).toContain('irs.gov');
    });

    it('should detect netflix typosquatting', () => {
      const signals = checkTyposquatting('netfllx.com');

      expect(signals.length).toBeGreaterThan(0);
      expect(signals[0].description).toContain('netflix.com');
    });

    it('should not flag subdomains of legitimate sites', () => {
      const signals = checkTyposquatting('login.amazon.com');
      // This is actually legitimate, and more than 2 edit distance from base domains
      expect(signals.length).toBe(0);
    });

    it('should handle empty string gracefully', () => {
      const signals = checkTyposquatting('');
      expect(Array.isArray(signals)).toBe(true);
    });
  });

  describe('Combined URL analysis', () => {
    it('should detect both structure and typosquatting issues', () => {
      const url = 'http://amaz0n.com';

      const structureSignals = analyzeUrlStructure(url);
      const typoSignals = checkTyposquatting(url);

      // Should have non-HTTPS warning
      const httpsIssues = structureSignals.filter(s => s.pattern === 'non-https');
      expect(httpsIssues.length).toBe(1);

      // Should have typosquatting warning
      expect(typoSignals.length).toBeGreaterThan(0);
    });

    it('should handle fully malicious URL with multiple red flags', () => {
      const url = 'http://scam.tk@192.168.1.1:8080/login';

      const structureSignals = analyzeUrlStructure(url);

      expect(structureSignals.length).toBeGreaterThan(3);

      // Check for specific issues
      const ipIssues = structureSignals.filter(s => s.pattern === 'ip-address-hostname');
      const atSignIssues = structureSignals.filter(s => s.pattern === 'at-sign-trick');
      const httpsIssues = structureSignals.filter(s => s.pattern === 'non-https');
      const portIssues = structureSignals.filter(s => s.pattern === 'suspicious-port');

      expect(ipIssues.length).toBeGreaterThan(0);
      expect(atSignIssues.length).toBeGreaterThan(0);
      expect(httpsIssues.length).toBeGreaterThan(0);
      expect(portIssues.length).toBeGreaterThan(0);
    });
  });
});
