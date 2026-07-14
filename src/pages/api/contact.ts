import type { NextApiRequest, NextApiResponse } from 'next';
import { checkBotId } from 'botid/server';
import { botIdOptions } from '../../lib/botid';
import { Resend } from 'resend';
import { promises as dns } from 'dns';
import { field, escapeHtml, sanitizeDisplayName, safeIp, rateLimit } from '../../lib/security';

const resend = new Resend(process.env.RESEND_API_KEY);

async function validateEmail(email: string): Promise<string | null> {
  // Level 1 — format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email format';

  const domain = email.split('@')[1].toLowerCase();

  // Level 2 — disposable/fake domains
  const blocked = [
    'mailinator.com','guerrillamail.com','tempmail.com','throwaway.email',
    'fakeinbox.com','sharklasers.com','yopmail.com','trashmail.com',
    'dispostable.com','maildrop.cc','spam4.me','grr.la','guerrillamailblock.com',
    'tempinbox.com','throwam.com','spamgourmet.com','mailnull.com',
  ];
  if (blocked.includes(domain)) return 'Please use a real email address';

  // Level 3 — DNS MX check
  try {
    const records = await dns.resolveMx(domain);
    if (!records || records.length === 0) return 'Email domain does not exist';
  } catch {
    return 'Email domain could not be verified';
  }

  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Bot check runs first — before parsing, validating, or spending a Resend send
  // on a request we're going to throw away anyway.
  const verification = await checkBotId(botIdOptions);
  if (verification.isBot) return res.status(403).json({ error: 'Access denied' });

  const rawIp =
    req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
    req.headers['x-real-ip']?.toString() ||
    req.socket.remoteAddress ||
    '';
  const validIp = safeIp(rawIp);

  // Rate limit (best-effort, per instance) keyed by client IP. The IP is used
  // only as an in-memory bucket key for the window below — it is never logged,
  // geolocated, emailed, or persisted anywhere.
  if (!rateLimit(`contact:${validIp || rawIp || 'unknown'}`, 5, 60_000))
    return res.status(429).json({ error: 'Too many requests. Please try again shortly.' });

  // Coerce + length-cap all inputs before doing anything with them.
  const name = field(req.body?.name, 100);
  const email = field(req.body?.email, 254);
  const subject = field(req.body?.subject, 150);
  const message = field(req.body?.message, 5000);

  if (!name || !email || !subject || !message)
    return res.status(400).json({ error: 'All fields are required' });

  // Validate email
  const emailError = await validateEmail(email);
  if (emailError) return res.status(400).json({ error: emailError });

  try {
    await resend.emails.send({
      from: `${sanitizeDisplayName(name)} <onboarding@resend.dev>`,
      to: 'alaafayyadp1@gmail.com',
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f8f8fc; border-radius: 12px;">
          <div style="background: linear-gradient(135deg, #6366f1, #a855f7); padding: 24px; border-radius: 10px; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 1.4rem;">✉️ New Message from Portfolio</h1>
          </div>
          <div style="background: white; padding: 24px; border-radius: 10px; border: 1px solid #e5e7eb;">
            <p style="margin: 0 0 12px;"><strong style="color: #6366f1;">Name:</strong> ${escapeHtml(name)}</p>
            <p style="margin: 0 0 12px;"><strong style="color: #6366f1;">Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
            <p style="margin: 0 0 12px;"><strong style="color: #6366f1;">Subject:</strong> ${escapeHtml(subject)}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
            <p style="margin: 0 0 16px; line-height: 1.7; color: #374151;">
              <strong style="color: #6366f1;">Message:</strong><br/>${escapeHtml(message).replace(/\n/g, '<br/>')}
            </p>
          </div>
          <p style="text-align: center; color: #9ca3af; font-size: 0.75rem; margin-top: 20px;">Sent from your portfolio</p>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
