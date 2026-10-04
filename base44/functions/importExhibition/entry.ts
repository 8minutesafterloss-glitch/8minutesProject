import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const SHEET_ID = '1A6yQ7yxKPUVZZUALUNp9mKZbOXr3C9r8';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField);
        currentField = '';
      } else if (char === '\n') {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else if (char === '\r') {
        // skip carriage return
      } else {
        currentField += char;
      }
    }
  }
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }
  return rows;
}

function boolFromHebrew(val) {
  if (!val) return false;
  const v = val.trim();
  return v.startsWith('כן') || v === 'true' || v === 'True';
}

function slugFromEmail(email) {
  if (!email) return '';
  const prefix = email.split('@')[0].trim().toLowerCase();
  return prefix + '8minutes';
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden — admin only' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const clearFirst = body.clear_first === true;

    const resp = await fetch(CSV_URL);
    if (!resp.ok) {
      return Response.json({ error: 'Failed to fetch sheet: ' + resp.status }, { status: 502 });
    }
    const csvText = await resp.text();
    const rows = parseCSV(csvText);

    if (rows.length < 2) {
      return Response.json({ error: 'No data rows found' }, { status: 400 });
    }

    // Skip header row
    const dataRows = rows.slice(1);

    const records = [];
    for (const row of dataRows) {
      // Skip empty rows
      if (!row.some((c) => c.trim())) continue;

      const email = (row[4] || '').trim();      // E: תיבת דוא"ל
      const submitEmail = (row[1] || '').trim(); // B: כתובת אימייל
      const artistName = (row[2] || '').trim();  // C: פרטים אישיים
      const title = (row[9] || '').trim();       // J: שם היצירה

      if (!artistName && !title) continue;

      const slug = slugFromEmail(email || submitEmail);
      if (!slug) continue;

      records.push({
        title: title || 'יצירה ללא שם',
        artist_name: artistName,
        email: email || submitEmail,
        location: (row[6] || '').trim(),              // G: מאיפה את בארץ
        age: (row[5] || '').trim(),                   // F: גיל
        ac_field: (row[7] || '').trim(),              // H: ספרו לנו על עצמכם ועל החיבור — מוצג תחת "על היוצר/ת"
        file_url: (row[8] || '').trim(),              // I: קובץ היצירה
        technical_details: (row[10] || '').trim(),   // K: פרטים טכניים
        text_permission: boolFromHebrew(row[11]),     // L
        photo_permission: boolFromHebrew(row[13]),    // N
        audience_connection: (row[15] || '').trim(),  // P
        artwork_story: (row[16] || '').trim(),        // Q
        community_member: boolFromHebrew(row[17]),    // R
        // about_artist intentionally NOT imported — no separate "about" column
        // exists in the sheet; it stays an independently-editable field.
        slug,
      });
    }

    if (records.length === 0) {
      return Response.json({ error: 'No valid records to import' }, { status: 400 });
    }

    let deletedCount = 0;
    if (clearFirst) {
      const result = await base44.asServiceRole.entities.ExhibitionItem.deleteMany({});
      deletedCount = result.deleted_count || 0;
    }

    // Bulk create in batches of 100
    let created = 0;
    for (let i = 0; i < records.length; i += 100) {
      const batch = records.slice(i, i + 100);
      await base44.asServiceRole.entities.ExhibitionItem.bulkCreate(batch);
      created += batch.length;
    }

    return Response.json({
      status: 'success',
      imported: created,
      deleted_before: deletedCount,
      total_rows_in_sheet: dataRows.length,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}