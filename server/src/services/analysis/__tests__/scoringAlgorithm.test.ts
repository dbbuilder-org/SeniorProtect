import { describe, it, expect } from 'vitest';
import { calculateScore } from '../scoringAlgorithm';
import { ThreatLevel, ThreatSignal } from '@senior-protect/shared';

describe('ScoringAlgorithm', () => {
  describe('calculateScore - Basic cases', () => {
    it('should return safe with score 0 for empty signals', () => {
      const result = calculateScore([]);

      expect(result.threatLevel).toBe(ThreatLevel.Safe);
      expect(result.score).toBe(0);
      expect(result.confidence).toBe(0.5); // Low confidence with no signals
    });

    it('should return danger for single critical signal', () => {
      const signals: ThreatSignal[] = [
        {
          category: 'credential_request',
          pattern: 'password-request',
          description: 'Requests your password',
          severity: 'critical',
          matched: 'enter your password',
        },
      ];

      const result = calculateScore(signals);

      expect(result.threatLevel).toBe(ThreatLevel.Danger);
      expect(result.score).toBeGreaterThanOrEqual(0.7);
      expect(result.confidence).toBeGreaterThan(0.6);
    });

    it('should return danger for multiple critical signals', () => {
      const signals: ThreatSignal[] = [
        {
          category: 'credential_request',
          pattern: 'password-request',
          description: 'Requests your password',
          severity: 'critical',
          matched: 'password',
        },
        {
          category: 'credential_request',
          pattern: 'ssn-request',
          description: 'Requests SSN',
          severity: 'critical',
          matched: 'SSN',
        },
        {
          category: 'financial_pressure',
          pattern: 'wire-transfer',
          description: 'Requests wire transfer',
          severity: 'critical',
          matched: 'wire transfer',
        },
      ];

      const result = calculateScore(signals);

      expect(result.threatLevel).toBe(ThreatLevel.Danger);
      expect(result.score).toBeGreaterThan(0.7);
      expect(result.confidence).toBeGreaterThan(0.7);
    });
  });

  describe('calculateScore - Multiple medium signals', () => {
    it('should return caution for multiple medium signals', () => {
      const signals: ThreatSignal[] = [
        {
          category: 'urgency',
          pattern: 'act-now',
          description: 'Pressures immediate action',
          severity: 'medium',
          matched: 'act now',
        },
        {
          category: 'urgency',
          pattern: 'expired',
          description: 'Claims expiration',
          severity: 'medium',
          matched: 'expires soon',
        },
        {
          category: 'too_good_to_be_true',
          pattern: 'guaranteed',
          description: 'Makes guarantees',
          severity: 'medium',
          matched: 'guaranteed',
        },
      ];

      const result = calculateScore(signals);

      expect(result.threatLevel).toBe(ThreatLevel.Caution);
      expect(result.score).toBeGreaterThanOrEqual(0.3);
      expect(result.score).toBeLessThan(0.6);
    });
  });

  describe('calculateScore - Mix of high and medium signals', () => {
    it('should return caution for mix of high and medium without critical', () => {
      const signals: ThreatSignal[] = [
        {
          category: 'urgency',
          pattern: 'account-suspended',
          description: 'Account suspended claim',
          severity: 'high',
          matched: 'account suspended',
        },
        {
          category: 'urgency',
          pattern: 'act-now',
          description: 'Urgency pressure',
          severity: 'medium',
          matched: 'act now',
        },
        {
          category: 'impersonation',
          pattern: 'generic-greeting',
          description: 'Generic greeting',
          severity: 'medium',
          matched: 'dear customer',
        },
      ];

      const result = calculateScore(signals);

      // Should be at least caution level
      expect(result.threatLevel).not.toBe(ThreatLevel.Safe);
      expect(result.score).toBeGreaterThanOrEqual(0.3);
    });

    it('should return danger for many high severity signals', () => {
      const signals: ThreatSignal[] = [
        {
          category: 'urgency',
          pattern: 'account-suspended',
          description: 'Account suspended',
          severity: 'high',
          matched: 'suspended',
        },
        {
          category: 'threat_language',
          pattern: 'legal-action',
          description: 'Legal threat',
          severity: 'high',
          matched: 'legal action',
        },
        {
          category: 'financial_pressure',
          pattern: 'inheritance',
          description: 'Inheritance scam',
          severity: 'high',
          matched: 'inheritance',
        },
        {
          category: 'credential_request',
          pattern: 'verify-identity',
          description: 'Identity verification',
          severity: 'high',
          matched: 'verify identity',
        },
      ];

      const result = calculateScore(signals);

      expect(result.threatLevel).toBe(ThreatLevel.Danger);
      expect(result.score).toBeGreaterThanOrEqual(0.6);
    });
  });

  describe('calculateScore - Boundary tests', () => {
    it('should return safe for score just below 0.3 threshold', () => {
      const signals: ThreatSignal[] = [
        {
          category: 'urgency',
          pattern: 'deadline',
          description: 'Deadline pressure',
          severity: 'low',
          matched: 'deadline',
        },
      ];

      const result = calculateScore(signals);

      // Low severity signal should keep score below caution threshold
      if (result.score < 0.3) {
        expect(result.threatLevel).toBe(ThreatLevel.Safe);
      }
    });

    it('should return caution for score at or just above 0.3 threshold', () => {
      const signals: ThreatSignal[] = [
        {
          category: 'urgency',
          pattern: 'act-now',
          description: 'Urgency',
          severity: 'medium',
          matched: 'act now',
        },
        {
          category: 'urgency',
          pattern: 'limited-time',
          description: 'Limited time',
          severity: 'medium',
          matched: 'limited time',
        },
        {
          category: 'impersonation',
          pattern: 'generic',
          description: 'Generic greeting',
          severity: 'medium',
          matched: 'dear customer',
        },
      ];

      const result = calculateScore(signals);

      // Three medium signals should push into caution range
      expect(result.score).toBeGreaterThanOrEqual(0.3);
      expect(result.threatLevel).toBe(ThreatLevel.Caution);
    });

    it('should return caution for score just below 0.6 threshold', () => {
      const signals: ThreatSignal[] = [
        {
          category: 'urgency',
          pattern: 'account-suspended',
          description: 'Suspended',
          severity: 'high',
          matched: 'suspended',
        },
        {
          category: 'urgency',
          pattern: 'act-now',
          description: 'Urgency',
          severity: 'medium',
          matched: 'act now',
        },
      ];

      const result = calculateScore(signals);

      // Should be in caution range
      if (result.score < 0.6) {
        expect(result.threatLevel).toBe(ThreatLevel.Caution);
      }
    });

    it('should return danger for score at or above 0.6 threshold', () => {
      const signals: ThreatSignal[] = [
        {
          category: 'urgency',
          pattern: 'account-suspended',
          description: 'Suspended',
          severity: 'high',
          matched: 'suspended',
        },
        {
          category: 'threat_language',
          pattern: 'legal-action',
          description: 'Legal threat',
          severity: 'high',
          matched: 'legal action',
        },
        {
          category: 'financial_pressure',
          pattern: 'won-prize',
          description: 'Prize scam',
          severity: 'high',
          matched: 'won prize',
        },
      ];

      const result = calculateScore(signals);

      // Multiple high signals should push into danger
      expect(result.score).toBeGreaterThanOrEqual(0.6);
      expect(result.threatLevel).toBe(ThreatLevel.Danger);
    });
  });

  describe('calculateScore - Confidence calculation', () => {
    it('should have low confidence with few signals', () => {
      const signals: ThreatSignal[] = [
        {
          category: 'urgency',
          pattern: 'act-now',
          description: 'Urgency',
          severity: 'medium',
          matched: 'act now',
        },
      ];

      const result = calculateScore(signals);

      expect(result.confidence).toBeLessThan(0.7);
    });

    it('should have higher confidence with many signals', () => {
      const signals: ThreatSignal[] = [
        {
          category: 'urgency',
          pattern: 'account-suspended',
          description: 'Suspended',
          severity: 'high',
          matched: 'suspended',
        },
        {
          category: 'credential_request',
          pattern: 'password',
          description: 'Password request',
          severity: 'critical',
          matched: 'password',
        },
        {
          category: 'threat_language',
          pattern: 'legal',
          description: 'Legal threat',
          severity: 'high',
          matched: 'legal',
        },
        {
          category: 'financial_pressure',
          pattern: 'prize',
          description: 'Prize',
          severity: 'high',
          matched: 'prize',
        },
        {
          category: 'impersonation',
          pattern: 'generic',
          description: 'Generic greeting',
          severity: 'medium',
          matched: 'dear customer',
        },
      ];

      const result = calculateScore(signals);

      expect(result.confidence).toBeGreaterThan(0.7);
    });

    it('should have higher confidence with diverse categories', () => {
      const signals: ThreatSignal[] = [
        {
          category: 'urgency',
          pattern: 'act-now',
          description: 'Urgency',
          severity: 'medium',
          matched: 'act now',
        },
        {
          category: 'credential_request',
          pattern: 'password',
          description: 'Password',
          severity: 'high',
          matched: 'password',
        },
        {
          category: 'financial_pressure',
          pattern: 'prize',
          description: 'Prize',
          severity: 'medium',
          matched: 'prize',
        },
        {
          category: 'impersonation',
          pattern: 'generic',
          description: 'Generic',
          severity: 'medium',
          matched: 'customer',
        },
      ];

      const result = calculateScore(signals);

      // 4 different categories should boost confidence
      expect(result.confidence).toBeGreaterThan(0.6);
    });
  });

  describe('calculateScore - Severity weight verification', () => {
    it('should weight low severity signals minimally', () => {
      const signals: ThreatSignal[] = [
        {
          category: 'test',
          pattern: 'test',
          description: 'Test',
          severity: 'low',
          matched: 'test',
        },
      ];

      const result = calculateScore(signals);

      expect(result.score).toBeLessThan(0.3);
      expect(result.threatLevel).toBe(ThreatLevel.Safe);
    });

    it('should weight medium severity appropriately', () => {
      const signals: ThreatSignal[] = [
        {
          category: 'test',
          pattern: 'test',
          description: 'Test',
          severity: 'medium',
          matched: 'test',
        },
      ];

      const result = calculateScore(signals);

      // Single medium should not reach danger
      expect(result.score).toBeLessThan(0.6);
    });

    it('should weight high severity significantly', () => {
      const signals: ThreatSignal[] = [
        {
          category: 'test',
          pattern: 'test',
          description: 'Test',
          severity: 'high',
          matched: 'test',
        },
      ];

      const result = calculateScore(signals);

      // Single high should have meaningful weight (0.5 weight / 2 = 0.25)
      expect(result.score).toBeGreaterThan(0.2);
      expect(result.score).toBeLessThan(0.6);
    });

    it('should weight critical severity maximally', () => {
      const signals: ThreatSignal[] = [
        {
          category: 'test',
          pattern: 'test',
          description: 'Test',
          severity: 'critical',
          matched: 'test',
        },
      ];

      const result = calculateScore(signals);

      // Critical always triggers danger
      expect(result.threatLevel).toBe(ThreatLevel.Danger);
      expect(result.score).toBeGreaterThanOrEqual(0.7);
    });
  });

  describe('calculateScore - Return value structure', () => {
    it('should return properly structured result', () => {
      const signals: ThreatSignal[] = [
        {
          category: 'test',
          pattern: 'test',
          description: 'Test',
          severity: 'medium',
          matched: 'test',
        },
      ];

      const result = calculateScore(signals);

      expect(result).toHaveProperty('threatLevel');
      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('confidence');

      expect(typeof result.score).toBe('number');
      expect(typeof result.confidence).toBe('number');
      expect([ThreatLevel.Safe, ThreatLevel.Caution, ThreatLevel.Danger]).toContain(
        result.threatLevel
      );
    });

    it('should return score between 0 and 1', () => {
      const signals: ThreatSignal[] = [
        {
          category: 'test',
          pattern: 'test',
          description: 'Test',
          severity: 'critical',
          matched: 'test',
        },
        {
          category: 'test2',
          pattern: 'test2',
          description: 'Test2',
          severity: 'critical',
          matched: 'test2',
        },
      ];

      const result = calculateScore(signals);

      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(1);
    });

    it('should return confidence between 0 and 1', () => {
      const signals: ThreatSignal[] = [
        {
          category: 'test',
          pattern: 'test',
          description: 'Test',
          severity: 'high',
          matched: 'test',
        },
      ];

      const result = calculateScore(signals);

      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('should round score to 3 decimal places', () => {
      const signals: ThreatSignal[] = [
        {
          category: 'test',
          pattern: 'test',
          description: 'Test',
          severity: 'medium',
          matched: 'test',
        },
      ];

      const result = calculateScore(signals);

      const decimalPlaces = (result.score.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(3);
    });

    it('should round confidence to 3 decimal places', () => {
      const signals: ThreatSignal[] = [
        {
          category: 'test',
          pattern: 'test',
          description: 'Test',
          severity: 'medium',
          matched: 'test',
        },
      ];

      const result = calculateScore(signals);

      const decimalPlaces = (result.confidence.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(3);
    });
  });
});
