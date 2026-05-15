// server/sources/gcal.js
// Fetches calendar events from a private Google Calendar ICS feed.
// Env vars: GCAL_ICS_URL  — the "Secret address in iCal format" from Google Calendar settings
//           GCAL_TIMEZONE — IANA timezone for after-hours detection (e.g. 'America/Los_Angeles')
//                           defaults to process local timezone

const STUB_ITEMS = [
  { time: '7:55a',    from: 'Theo R',         text: 'declined Tue 2pm panel · sent at 7:55a',  urgent: true,  decline: true,  afterHrs: false },
  { time: '9:00a',    from: 'L. Park onsite', text: 'block missing 1 interviewer (Eva K)',      urgent: true,  decline: false, afterHrs: false },
  { time: '10:30a',   from: 'J. Alvarez TPM', text: 'Devon P accepted',                         urgent: false, decline: false, afterHrs: false },
  { time: '2:15p',    from: 'Lin Y',          text: 'declined Fri 11am — calendar conflict',    urgent: true,  decline: true,  afterHrs: false },
  { time: 'after 6p', from: 'Marcus W',       text: 'declined invite (after hours)',            urgent: true,  decline: true,  afterHrs: true  },
];

// Unfold ICS continuation lines (RFC 5545 §3.1)
function unfold(text) {
  return text.replace(/\r?\n[ \t]/g, '');
}

// Parse a DTSTART/DTEND value into a Date.
// Handles: 20260515T090000Z  20260515T090000  20260515
function parseIcsDate(val) {
  val = val.trim();
  if (/^\d{8}T\d{6}Z$/.test(val)) {
    // UTC
    return new Date(
      `${val.slice(0,4)}-${val.slice(4,6)}-${val.slice(6,8)}T${val.slice(9,11)}:${val.slice(11,13)}:${val.slice(13,15)}Z`
    );
  }
  if (/^\d{8}T\d{6}$/.test(val)) {
    // Floating / local — treat as local
    return new Date(
      `${val.slice(0,4)}-${val.slice(4,6)}-${val.slice(6,8)}T${val.slice(9,11)}:${val.slice(11,13)}:${val.slice(13,15)}`
    );
  }
  if (/^\d{8}$/.test(val)) {
    // All-day date
    return new Date(`${val.slice(0,4)}-${val.slice(4,6)}-${val.slice(6,8)}`);
  }
  return new Date(val);
}

function parseVevents(text) {
  const body = unfold(text);
  const events = [];
  const re = /BEGIN:VEVENT([\s\S]*?)END:VEVENT/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    const block = m[1];
    const ev = { attendees: [] };
    for (const rawLine of block.split(/\r?\n/)) {
      const colon = rawLine.indexOf(':');
      if (colon < 0) continue;
      const prop = rawLine.slice(0, colon);   // e.g. ATTENDEE;CN=Foo;PARTSTAT=DECLINED
      const val  = rawLine.slice(colon + 1).trim();
      const propName = prop.split(';')[0].toUpperCase();

      if (propName === 'SUMMARY') {
        ev.summary = val;
      } else if (propName === 'DTSTART') {
        ev.dtstart = parseIcsDate(val);
      } else if (propName === 'DTEND') {
        ev.dtend = parseIcsDate(val);
      } else if (propName === 'LAST-MODIFIED' || propName === 'DTSTAMP') {
        if (!ev.updated) ev.updated = parseIcsDate(val);
      } else if (propName === 'ATTENDEE') {
        const cnM     = prop.match(/CN=([^;:]+)/i);
        const partM   = prop.match(/PARTSTAT=([^;:]+)/i);
        const email   = val.replace(/^mailto:/i, '');
        ev.attendees.push({
          name:    cnM    ? cnM[1]    : email,
          email,
          partstat: partM ? partM[1].toUpperCase() : 'NEEDS-ACTION',
        });
      }
    }
    if (ev.summary || ev.dtstart) events.push(ev);
  }
  return events;
}

function formatTime(date) {
  let h = date.getHours();
  const m = date.getMinutes();
  const ampm = h >= 12 ? 'p' : 'a';
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, '0')}${ampm}`;
}

function hourInTz(date, tz) {
  if (!tz) return date.getHours();
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hour: 'numeric', hour12: false,
    }).formatToParts(date);
    const h = parts.find(p => p.type === 'hour');
    return h ? parseInt(h.value, 10) % 24 : date.getHours();
  } catch {
    return date.getHours();
  }
}

export async function fetchGcal() {
  const icsUrl = process.env.GCAL_ICS_URL;
  if (!icsUrl) {
    return { gcalFeed: STUB_ITEMS };
  }

  try {
    const res = await fetch(icsUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();

    const tz = process.env.GCAL_TIMEZONE;
    const now = new Date();
    const todayStr = now.toDateString();

    const events = parseVevents(text);
    const items = [];

    for (const ev of events) {
      if (!ev.dtstart) continue;

      // Only include events happening today or in the next 7 days
      const diffDays = (ev.dtstart - now) / 86400000;
      if (diffDays < -1 || diffDays > 7) continue;

      const isToday = ev.dtstart.toDateString() === todayStr;

      // Surface declined attendees
      for (const att of ev.attendees) {
        if (att.partstat !== 'DECLINED') continue;
        const updatedHour = ev.updated ? hourInTz(ev.updated, tz) : -1;
        const afterHrs = updatedHour !== -1 && (updatedHour >= 18 || updatedHour < 6);
        const timeLabel = afterHrs
          ? 'after 6p'
          : ev.updated
            ? formatTime(ev.updated)
            : formatTime(ev.dtstart);

        items.push({
          time:    timeLabel,
          from:    att.name,
          text:    `declined "${ev.summary || 'event'}"`,
          urgent:  isToday || afterHrs,
          decline: true,
          afterHrs,
        });
      }

      // Surface today's events with no confirmed attendees (possible scheduling gap)
      if (isToday && ev.attendees.length > 0) {
        const confirmed = ev.attendees.filter(a => a.partstat === 'ACCEPTED').length;
        const total     = ev.attendees.length;
        if (confirmed === 0 && total > 1) {
          items.push({
            time:    formatTime(ev.dtstart),
            from:    ev.summary || 'event',
            text:    `no confirmed attendees (${total} invited)`,
            urgent:  true,
            decline: false,
            afterHrs: false,
          });
        }
      }
    }

    if (items.length === 0) return { gcalFeed: STUB_ITEMS };
    return { gcalFeed: items };
  } catch (err) {
    console.warn('[gcal] fetch failed, using stub:', err.message);
    return { gcalFeed: STUB_ITEMS };
  }
}
