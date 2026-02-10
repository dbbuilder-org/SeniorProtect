import { Resend } from 'resend';
import { env } from '../../config/env.js';

const FROM_ADDRESS = 'SeniorProtect <noreply@servicevision.net>';

let resend: Resend | null = null;

function getResend(): Resend | null {
  if (!env.resendApiKey) return null;
  if (!resend) {
    resend = new Resend(env.resendApiKey);
  }
  return resend;
}

export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  const client = getResend();
  if (!client) return;

  await client.emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: 'Welcome to SeniorProtect!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h1 style="color: #1565C0; font-size: 24px;">Welcome to SeniorProtect!</h1>
        <p style="font-size: 18px; line-height: 1.6; color: #333;">
          Hi ${name},
        </p>
        <p style="font-size: 18px; line-height: 1.6; color: #333;">
          Thank you for joining SeniorProtect — your trusted companion for staying safe online.
        </p>
        <p style="font-size: 18px; line-height: 1.6; color: #333;">
          You can now check emails, text messages, and links for potential scams. We're here to help
          you navigate the internet with confidence.
        </p>
        <p style="font-size: 18px; line-height: 1.6; color: #333;">
          Remember: there's no shame in being cautious. Checking something suspicious is always the smart thing to do.
        </p>
        <p style="font-size: 16px; color: #666; margin-top: 32px;">
          — The SeniorProtect Team
        </p>
      </div>
    `,
  });
}

export async function sendDangerAlertEmail(
  email: string,
  name: string,
  summary: string,
  contentType: string
): Promise<void> {
  const client = getResend();
  if (!client) return;

  await client.emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: `⚠️ SeniorProtect: Dangerous ${contentType} detected`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h1 style="color: #B71C1C; font-size: 24px;">⚠️ Danger Alert</h1>
        <p style="font-size: 18px; line-height: 1.6; color: #333;">
          Hi ${name},
        </p>
        <p style="font-size: 18px; line-height: 1.6; color: #333;">
          A ${contentType} you just checked was flagged as <strong style="color: #B71C1C;">dangerous</strong>.
        </p>
        <div style="background: #FFEBEE; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="font-size: 18px; line-height: 1.6; color: #B71C1C; margin: 0;">
            ${summary}
          </p>
        </div>
        <p style="font-size: 18px; line-height: 1.6; color: #333;">
          <strong>Do not</strong> click any links, reply, or share personal information. If you've already
          responded, contact your bank or the relevant service immediately.
        </p>
        <p style="font-size: 16px; color: #666; margin-top: 32px;">
          — The SeniorProtect Team
        </p>
      </div>
    `,
  });
}
