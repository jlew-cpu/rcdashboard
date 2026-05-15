// server/sources/modernloop.js
// ModernLoop data source.
// Env vars: MODERNLOOP_API_KEY
// Note: ModernLoop's API is not publicly documented. This module returns
// stubs for all data. When an API key is set, it attempts a best-effort
// call to log the response shape, then falls back to stubs.

const STUB_ML_FEED = [
  { time: 'live',   from: 'REQ-2041',          ctx: 'my tasks', text: 'Sr ML panel · needs 5 interviewers · 1h old', urgent: true  },
  { time: 'live',   from: 'REQ-2035',          ctx: 'my tasks', text: 'Staff iOS · no candidate response · 2d',       urgent: true  },
  { time: '9:30a',  from: 'REQ-2039',          ctx: 'my tasks', text: 'PD phone · new request from Devon P',          urgent: false },
  { time: '11:45a', from: 'REQ-2042',          ctx: 'alerts',   text: 'RE Alignment · debrief mismatch with Gcal',    urgent: true  },
  { time: '1:00p',  from: 'Module · TS Front', ctx: 'modules',  text: 'low coverage flag (3 trained)',                urgent: false },
];

const STUB_INTERVIEWERS = [
  { name: 'Priya Nadar',  hours: 8.5, cap: 6, sched: 12, done: 7,  kinds: { HM: 5, CD: 4, SD: 3 } },
  { name: 'David Lin',    hours: 9.0, cap: 8, sched: 11, done: 6,  kinds: { CD: 5, SD: 4, TS: 2 } },
  { name: 'Eva Kowalski', hours: 6.5, cap: 6, sched: 9,  done: 5,  kinds: { CL: 4, HM: 3, TS: 2 } },
  { name: 'James Kim',    hours: 5.0, cap: 6, sched: 7,  done: 4,  kinds: { CL: 4, TS: 3 } },
  { name: 'Sara Mendez',  hours: 4.5, cap: 6, sched: 6,  done: 3,  kinds: { TS: 4, CD: 2 } },
  { name: 'Theo Reyes',   hours: 3.0, cap: 6, sched: 4,  done: 2,  kinds: { CL: 3, HM: 1 } },
  { name: 'Lin Yamamoto', hours: 2.5, cap: 4, sched: 3,  done: 1,  kinds: { SD: 2, CD: 1 } },
  { name: 'Marcus Webb',  hours: 1.5, cap: 6, sched: 2,  done: 1,  kinds: { TS: 2 } },
];

const STUB_QUEUE = {
  me:      { name: 'Alex Chen', initials: 'AC' },
  partner: { name: 'Sam Reyes', initials: 'SR' },
  stats: [
    { label: 'Requests picked up',   me: 14,     them: 11,     lowerBetter: false },
    { label: 'Interviews scheduled', me: 28,     them: 24,     lowerBetter: false },
    { label: 'Confirmed',            me: 22,     them: 19,     lowerBetter: false },
    { label: 'Pending > 24h',        me: 3,      them: 5,      lowerBetter: true  },
    { label: 'Avg time-to-schedule', me: '1.2d', them: '1.6d'                      },
  ],
};

const STUB_MODULES = [
  { name: 'HM Screen · ML/Research', done: 13, sched: 18, health: 'ok',    trend: [10, 14, 16, 18] },
  { name: 'Coding · Python',          done: 14, sched: 22, health: 'ok',    trend: [18, 20, 21, 22] },
  { name: 'System Design · Infra',    done: 7,  sched: 11, health: 'stale', trend: [12, 10, 9,  11] },
  { name: 'Culture · Core',           done: 9,  sched: 14, health: 'ok',    trend: [12, 13, 14, 14] },
  { name: 'Tech Screen · Frontend',   done: 6,  sched: 9,  health: 'low',   trend: [4,  6,  7,  9]  },
  { name: 'Research Take-home',       done: 3,  sched: 6,  health: 'ok',    trend: [5,  6,  5,  6]  },
];

// KPI indices 1-4 (index 0 is Greenhouse)
const STUB_KPIS_ML = [
  { label: 'Scheduled · week',   value: '28', note: 'vs. Sam: 24',  warn: false },
  { label: 'Queue (mine)',        value: '14', note: '3 over 24h',   warn: true  },
  { label: 'Debrief mismatches', value: '3',  note: 'needs fix',    warn: true  },
  { label: 'Decline offenders',  value: '3',  note: '>25% rate',    warn: true  },
];

export async function fetchModernloop() {
  const apiKey = process.env.MODERNLOOP_API_KEY;

  if (apiKey) {
    // Best-effort attempt — ModernLoop API is not publicly documented.
    // Log the attempt and any error; fall back to stubs either way.
    try {
      console.log('[modernloop] API key found, attempting best-effort call...');
      const res = await fetch('https://api.modernloop.io/v1/scheduling-requests', {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        console.warn(`[modernloop] API responded ${res.status} — using stubs`);
      } else {
        const data = await res.json();
        console.log('[modernloop] raw response shape:', JSON.stringify(data).slice(0, 200));
        // TODO: map real API response to stub shape once API docs are available
      }
    } catch (err) {
      console.warn('[modernloop] fetch failed:', err.message);
    }
  }

  // Always return stubs (real API mapping not yet implemented)
  return {
    mlFeed:       STUB_ML_FEED,
    interviewers: STUB_INTERVIEWERS,
    queue:        STUB_QUEUE,
    modules:      STUB_MODULES,
    kpis_ml:      STUB_KPIS_ML,
  };
}
