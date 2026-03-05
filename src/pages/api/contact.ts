import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);


async function getGeoData(ip: string) {
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,lat,lon,isp`);
    const data = await res.json();
    if (data.status === 'success') return data;
  } catch {}
  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message)
    return res.status(400).json({ error: 'All fields are required' });

  const ip =
    req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
    req.headers['x-real-ip']?.toString() ||
    req.socket.remoteAddress ||
    'Unknown';

  const geo = await getGeoData(ip);

  const locationBlock = geo
    ? `
      <p style="margin: 0 0 8px;"><strong style="color: #6366f1;">📍 Location:</strong> ${geo.city}, ${geo.regionName}, ${geo.country}</p>
      <p style="margin: 0 0 8px;"><strong style="color: #6366f1;">🌐 ISP:</strong> ${geo.isp}</p>
      <p style="margin: 0 0 8px;"><strong style="color: #6366f1;">🗺️ Coordinates:</strong>
        <a href="https://www.google.com/maps?q=${geo.lat},${geo.lon}" target="_blank">
          ${geo.lat}, ${geo.lon} (View on Map)
        </a>
      </p>
    `
    : '';


  try {
    await resend.emails.send({
      from: `${name} <onboarding@resend.dev>`,
      to: 'alaafayyadp1@gmail.com',
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f8f8fc; border-radius: 12px;">
          <div style="background: linear-gradient(135deg, #6366f1, #a855f7); padding: 24px; border-radius: 10px; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 1.4rem;">✉️ New Message from Portfolio</h1>
          </div>
          <div style="background: white; padding: 24px; border-radius: 10px; border: 1px solid #e5e7eb;">
            <p style="margin: 0 0 12px;"><strong style="color: #6366f1;">Name:</strong> ${name}</p>
            <p style="margin: 0 0 12px;"><strong style="color: #6366f1;">Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 0 0 12px;"><strong style="color: #6366f1;">Subject:</strong> ${subject}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
            <p style="margin: 0 0 16px; line-height: 1.7; color: #374151;">
              <strong style="color: #6366f1;">Message:</strong><br/>${message.replace(/\n/g, '<br/>')}
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
            <div style="background: #f8f8fc; padding: 16px; border-radius: 8px; font-size: 0.8rem; color: #6b7280;">
              <p style="margin: 0 0 8px; font-weight: 700; color: #374151;">🔍 Sender Info</p>
              <p style="margin: 0 0 8px;"><strong style="color: #6366f1;">🖥️ IP Address:</strong> ${ip}</p>
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