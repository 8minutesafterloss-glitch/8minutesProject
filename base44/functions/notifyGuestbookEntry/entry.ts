import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const RECIPIENTS = [
  'roni.ambor@gmail.com',
  '8minutesafterloss@gmail.com',
  'neoraknobler@gmail.com'
];

const escapeHtml = (s: string): string =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const name = escapeHtml(body.name || 'אנונימי');
    const message = escapeHtml(body.message || '');
    const exhibitionItemSlug = escapeHtml(body.exhibition_item_id || '');

    const subject = 'רשם חדש בספר האורחים ממתין לאישור';
    const html = `
      <div dir="rtl" style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #46366c;">נוסף רשם חדש לספר האורחים</h2>
        <p><strong>שם:</strong> ${name}</p>
        <p><strong>הודעה:</strong></p>
        <p style="background: #f5f3f8; padding: 12px; border-radius: 8px; white-space: pre-wrap;">${message}</p>
        ${exhibitionItemSlug ? `<p><strong>קשור ליצירה:</strong> ${exhibitionItemSlug}</p>` : ''}
        <hr style="border: none; border-top: 1px solid #e0dce8; margin: 24px 0;" />
        <p style="color: #888; font-size: 14px;">כדי לאשר את הרשם, היכנס ללוח הניהול → ספר אורחים</p>
      </div>
    `;

    let sent = 0;
    for (const to of RECIPIENTS) {
      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to,
          subject,
          html
        });
        sent++;
      } catch (err) {
        console.error(`Failed to send to ${to}:`, err.message);
      }
    }

    return Response.json({ ok: true, sent, total: RECIPIENTS.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}