import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { topics, tone, channel, freeText, contextPrompt } = body || {};

    const topicStr = topics
      ? Array.isArray(topics)
        ? topics.join(', ')
        : topics
      : '';

    const prompt = `כתבי הודעה קצרה ואישית בעברית ל${contextPrompt || 'בן משפחה'}.
נושאים: ${topicStr || 'כללי'}.
טון: ${tone || 'עדין'}.
ערוץ שליחה: ${channel || 'וואטסאפ'}.
${freeText ? `הערות נוספות מהמשתמשת: ${freeText}.` : ''}
ההודעה צריכה להיות קצרה (3-5 משפטים לכל היותר), חמה, כנה, ומותאמת לערוץ השליחה. ללא נוסחאות כלליות או קלישאות. כתבי רק את גוף ההודעה, בלי הקדמות או הסברים.`;

    const res = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt });
    const text = typeof res === 'string' ? res : res?.text || '';
    return Response.json({ text });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}