// server/sources/gcal.js
// Google Calendar API data source.
// Env vars: GCAL_SERVICE_ACCOUNT_JSON (path to service account JSON file)
//           GCAL_USER_EMAIL (RC email address to impersonate via domain-wide delegation)
//           GCAL_TIMEZONE   (IANA timezone for after-hours detection, e.g. 'America/Los_Angeles';
//                            defaults to the process local timezone)

const STUB_ITEMS = [
  { time: '7:55a',    from: 'Theo R',         text: 'declined Tue 2pm panel · sent at 7:55a',  urgent: true,  decline: true,  afterHrs: false },
  { time: '9:00a',    from: 'L. Park onsite', text: 'block missing 1 interviewer (Eva K)',      urgent: true,  decline: false, afterHrs: false },
  { time: '10:30a',   from: 'J. Alvarez TPM', text: 'Devon P accepted',                         urgent: false, decline: false, afterHrs: false },
  { time: '2:15p',    from: 'Lin Y',          text: 'declined Fri 11am — calendar conflict',    urgent: true,  decline: true,  afterHrs: false },
  { time: 'after 6p', from: 'Marcus W',       text: 'declined invite (after hours)',            urgent: true,  decline: true,  afterHrs: true  },
];

export async function fetchGcal() {
  const keyFile = process.env.GCAL_SERVICE_ACCOUNT_JSON;
  const userEmail = process.env.GCAL_USER_EMAIL;

  if (!keyFile || !userEmail) {
    return { gcalFeed: STUB_ITEMS };
  }

  try {
    const { google } = await import('googleapis');

    const auth = new google.auth.GoogleAuth({
      keyFile,
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
      clientOptions: { subject: userEmail },
    });

    const calendar = google.calendar({ version: 'v3', auth });

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const endOfDay   = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();

    const eventsRes = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startOfDay,
      timeMax: endOfDay,
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 50,
    });

    // Resolve the hour of a timestamp in the configured timezone.
    // Returns -1 when dateStr is absent so callers can treat it as "no update time".
    const tz = process.env.GCAL_TIMEZONE;
    function updatedHourInTz(dateStr) {
      if (!dateStr) return -1;
      if (tz) {
        try {
          const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: tz, hour: 'numeric', hour12: false,
          }).formatToParts(new Date(dateStr));
          const h = parts.find(p => p.type === 'hour');
          return h ? parseInt(h.value, 10) % 24 : -1;
        } catch {
          // fall through to local time
        }
      }
      return new Date(dateStr).getHours();
    }

    const events = eventsRes.data.items || [];
    const items = [];

    for (const event of events) {
      const attendees = event.attendees || [];
      const declined  = attendees.filter(a => a.responseStatus === 'declined');

      for (const att of declined) {
        const updatedHour = updatedHourInTz(event.updated);
        // Only flag after-hours when an update timestamp is actually present.
        const afterHrs    = updatedHour !== -1 && (updatedHour >= 18 || updatedHour < 6);
        const startTime   = event.start?.dateTime || event.start?.date || '';
        const eventDate   = startTime ? new Date(startTime) : null;
        const isToday     = eventDate &&
          eventDate.getFullYear() === now.getFullYear() &&
          eventDate.getMonth()    === now.getMonth() &&
          eventDate.getDate()     === now.getDate();

        const timeLabel = afterHrs
          ? 'after 6p'
          : event.updated
            ? formatTime(new Date(event.updated))
            : formatTime(now);

        items.push({
          time:     timeLabel,
          from:     att.displayName || att.email || 'Unknown',
          text:     `declined "${event.summary || 'event'}"`,
          urgent:   isToday || afterHrs,
          decline:  true,
          afterHrs,
        });
      }
    }

    // If no declines found today, return stubs so the column isn't empty
    if (items.length === 0) {
      return { gcalFeed: STUB_ITEMS };
    }

    return { gcalFeed: items };
  } catch (err) {
    console.warn('[gcal] fetch failed, using stub:', err.message);
    return { gcalFeed: STUB_ITEMS };
  }
}

function formatTime(date) {
  let h = date.getHours();
  const m = date.getMinutes();
  const ampm = h >= 12 ? 'p' : 'a';
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, '0')}${ampm}`;
}
