import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { promises as dns } from 'dns';
import { escapeHtml, field, sanitizeDisplayName, safeIp, rateLimit } from '../../lib/security';

const resend = new Resend(process.env.RESEND_API_KEY);


async function validateEmail(email: string): Promise<string | null> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email format';

  const domain = email.split('@')[1].toLowerCase();

  const blocked = [
    'mailinator.com','guerrillamail.com','tempmail.com','throwaway.email',
    'fakeinbox.com','sharklasers.com','yopmail.com','trashmail.com',
    'dispostable.com','maildrop.cc','spam4.me','grr.la','guerrillamailblock.com',
    'tempinbox.com','throwam.com','spamgourmet.com','mailnull.com',
  ];
  if (blocked.includes(domain)) return 'Please use a real email address';

  try {
    const records = await dns.resolveMx(domain);
    if (!records || records.length === 0) return 'Email domain does not exist';
  } catch {
    return 'Email domain could not be verified';
  }

  return null;
}

async function getGeoData(ip: string) {
  // ip is pre-validated by safeIp(); encode defensively before use in the URL.
  try {
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,regionName,city,lat,lon,isp`
    );
    const data = await res.json();
    if (data.status === 'success') return data;
  } catch {}
  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const rawIp =
    req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
    req.headers['x-real-ip']?.toString() ||
    req.socket.remoteAddress ||
    '';
  const validIp = safeIp(rawIp);

  // Rate limit (best-effort, per instance) keyed by client IP.
  if (!rateLimit(`quote:${validIp || rawIp || 'unknown'}`, 5, 60_000))
    return res.status(429).json({ error: 'Too many requests. Please try again shortly.' });

  // Coerce + length-cap all inputs before doing anything with them.
  const name = field(req.body?.name, 100);
  const email = field(req.body?.email, 254);
  const projectType = field(req.body?.projectType, 100);
  const budget = field(req.body?.budget, 100);
  const timeline = field(req.body?.timeline, 100);
  const details = field(req.body?.details, 5000);

  if (!name || !email || !details)
    return res.status(400).json({ error: 'Required fields missing' });

  const emailError = await validateEmail(email);
  if (emailError) return res.status(400).json({ error: emailError });

  const geo = validIp ? await getGeoData(validIp) : null;
  const ipDisplay = validIp || 'Unknown';

  const locationBlock = geo
    ? `
      <p style="margin: 0 0 8px;"><strong style="color: #6366f1;">📍 Location:</strong> ${escapeHtml(geo.city)}, ${escapeHtml(geo.regionName)}, ${escapeHtml(geo.country)}</p>
      <p style="margin: 0 0 8px;"><strong style="color: #6366f1;">🌐 ISP:</strong> ${escapeHtml(geo.isp)}</p>
      <p style="margin: 0 0 8px;"><strong style="color: #6366f1;">🗺️ Coordinates:</strong>
        <a href="https://www.google.com/maps?q=${encodeURIComponent(geo.lat)},${encodeURIComponent(geo.lon)}" target="_blank" rel="noopener noreferrer">
          ${escapeHtml(geo.lat)}, ${escapeHtml(geo.lon)} (View on Map)
        </a>
      </p>
    `
    : '';


  try {
    await resend.emails.send({
      from: `${sanitizeDisplayName(name)} <onboarding@resend.dev>`,
      to: 'alaafayyadp1@gmail.com',
      replyTo: email,
      subject: `[Quote Request] ${projectType || 'New Project'} — ${name}`,
       html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f8f8fc; border-radius: 12px;">
          <div style="background: linear-gradient(135deg, #6366f1, #a855f7); padding: 24px; border-radius: 10px; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 1.4rem;">💼 New Quote Request</h1>
          </div>
          <div style="background: white; padding: 24px; border-radius: 10px; border: 1px solid #e5e7eb;">
            <p style="margin: 0 0 12px;"><strong style="color: #6366f1;">Name:</strong> ${escapeHtml(name)}</p>
            <p style="margin: 0 0 12px;"><strong style="color: #6366f1;">Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
            <p style="margin: 0 0 12px;"><strong style="color: #6366f1;">Project Type:</strong> ${escapeHtml(projectType) || 'Not specified'}</p>
            <p style="margin: 0 0 12px;"><strong style="color: #6366f1;">Budget:</strong> ${escapeHtml(budget) || 'Not specified'}</p>
            <p style="margin: 0 0 12px;"><strong style="color: #6366f1;">Timeline:</strong> ${escapeHtml(timeline) || 'Not specified'}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
            <p style="margin: 0 0 16px; line-height: 1.7; color: #374151;">
              <strong style="color: #6366f1;">Project Details:</strong><br/>${escapeHtml(details).replace(/\n/g, '<br/>')}
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
            <div style="background: #f8f8fc; padding: 16px; border-radius: 8px; font-size: 0.8rem; color: #6b7280;">
              <p style="margin: 0 0 8px; font-weight: 700; color: #374151;">🔍 Sender Info</p>
              <p style="margin: 0 0 8px;"><strong style="color: #6366f1;">🖥️ IP Address:</strong> ${escapeHtml(ipDisplay)}</p>
              ${locationBlock}
            </div>
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
