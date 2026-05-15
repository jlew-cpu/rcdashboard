// server/index.js
// Express backend for RC Dashboard.
// Polls data sources every 2 minutes and caches results in memory.
// GET /api/data returns the full dashboard payload.
// GET /       serves dashboard.html.

import 'dotenv/config';
import express from 'express';
import cron from 'node-cron';
import path from 'path';
import { fileURLToPath } from 'url';

import { fetchGreenhouse } from './sources/greenhouse.js';
import { fetchGcal }       from './sources/gcal.js';
import { fetchSlack }      from './sources/slack.js';
import { fetchModernloop } from './sources/modernloop.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir   = path.resolve(__dirname, '..');

// ── Static display metadata for each feed column ──────────────────────────
// Mirrors the FEED constant in dashboard.html (color/bg/border/label/sub).
// These are presentation values that never change and are not polled.
const FEED_META = {
  slack: {
    color: '#7B5EA7', bg: '#F5EFF9', border: '#C4A8E0',
    short: '#', label: 'Slack', sub: 'DMs · channels · pings',
  },
  gcal: {
    color: '#3D7CC9', bg: '#EBF2FA', border: '#90B8E8',
    short: 'Cal', label: 'Google Calendar', sub: 'RSVPs · declines · after-hours',
  },
  ml: {
    color: '#D97757', bg: '#FEF3EE', border: '#EEB49E',
    short: 'ML', label: 'ModernLoop', sub: 'My tasks · alerts · queue',
  },
};

// ── Stub team data (no live API source for team) ──────────────────────────
const STUB_TEAM = [
  { name: 'Maya Chen',    kind: 'recruiter', initials: 'MC', focus: 'Research + ML · 7 roles',
    people: [
      { name: 'R. Okafor',  role: 'Sr ML Engineer, Pretraining',  stage: 'Onsite' },
      { name: 'L. Park',    role: 'Research Engineer, Alignment', stage: 'Final'  },
      { name: 'S. Vora',    role: 'MoTS, RL',                     stage: 'Phone'  },
      { name: 'J. Patel',   role: 'Security Engineer',            stage: 'Phone'  },
    ] },
  { name: 'Devon Park',   kind: 'recruiter', initials: 'DP', focus: 'Product Eng + Design · 6 roles',
    people: [
      { name: 'J. Alvarez', role: 'TPM, Model Deployment',       stage: 'Onsite' },
      { name: 'M. Singh',   role: 'Sr Frontend, claude.ai',      stage: 'Onsite' },
      { name: 'K. Liu',     role: 'Product Designer, Claude',    stage: 'Phone'  },
      { name: 'T. Adeyemi', role: 'Staff iOS Engineer',          stage: 'Onsite' },
    ] },
  { name: 'Ananya Rao',   kind: 'sourcer', initials: 'AR', focus: 'Research scientists · 142 pipeline',
    people: [
      { name: 'H. Tanaka',  role: 'Research Scientist, Interp',   stage: 'Source'   },
      { name: 'P. Iyer',    role: 'Research Engineer, Alignment', stage: 'Outreach' },
      { name: 'N. Schmidt', role: 'Sr ML Engineer, Pretraining',  stage: 'Outreach' },
    ] },
  { name: 'Marco Silva',  kind: 'sourcer', initials: 'MS', focus: 'Infra + Security · 98 pipeline',
    people: [
      { name: 'D. Park',     role: 'Security Engineer',    stage: 'Source'   },
      { name: 'R. Banerjee', role: 'Infra SWE, Inference', stage: 'Outreach' },
    ] },
  { name: 'Jules Bennett', kind: 'sourcer', initials: 'JB', focus: 'Product + Design · 121 pipeline',
    people: [
      { name: 'C. Mendoza', role: 'Product Designer, Claude',  stage: 'Outreach' },
      { name: 'F. Akhtar',  role: 'Brand Designer',            stage: 'Source'   },
      { name: 'G. Wu',      role: 'Sr Frontend, claude.ai',    stage: 'Outreach' },
    ] },
];

// ── Stub declines (no live source; shown until Greenhouse integration built) ─
const STUB_DECLINES = [
  { name: 'Marcus Webb',  rate: 42, count: 23, total: 55, note: 'Often "not enough notice"',
    incidents: [
      { date: 'May 12', kind: 'TS', cand: 'R. Okafor',  outcome: 'rescheduled (3d slip)' },
      { date: 'May 8',  kind: 'TS', cand: 'K. Liu',     outcome: 'lost slot'             },
      { date: 'May 5',  kind: 'HM', cand: 'J. Alvarez', outcome: 'rescheduled'           },
      { date: 'Apr 30', kind: 'CD', cand: 'T. Adeyemi', outcome: 'lost slot'             },
    ] },
  { name: 'Lin Yamamoto', rate: 38, count: 18, total: 47, note: 'Declines Fri afternoons',
    incidents: [
      { date: 'May 10', kind: 'SD', cand: 'M. Singh', outcome: 'rescheduled' },
      { date: 'May 3',  kind: 'SD', cand: 'S. Vora',  outcome: 'lost slot'   },
      { date: 'Apr 26', kind: 'CD', cand: 'L. Park',  outcome: 'rescheduled' },
    ] },
  { name: 'Theo Reyes',   rate: 35, count: 14, total: 40, note: 'Calendar conflicts (recurring 1:1)',
    incidents: [
      { date: 'May 13', kind: 'CL', cand: 'R. Okafor', outcome: 'rescheduled today' },
      { date: 'May 6',  kind: 'CL', cand: 'H. Tanaka', outcome: 'rescheduled'       },
    ] },
];

// ── Seed the cache with stubs before first refresh ────────────────────────
// /api/data always returns valid data from the very first request.
let cache = buildStubCache();

function buildStubCache() {
  return {
    kpis: [
      { label: 'Open roles',         value: '23', note: 'across 5 functions', warn: false },
      { label: 'Scheduled · week',   value: '28', note: 'vs. Sam: 24',        warn: false },
      { label: 'Queue (mine)',        value: '14', note: '3 over 24h',         warn: true  },
      { label: 'Debrief mismatches', value: '3',  note: 'needs fix',          warn: true  },
      { label: 'Decline offenders',  value: '3',  note: '>25% rate',          warn: true  },
    ],
    feed: {
      slack: {
        ...FEED_META.slack,
        items: [
          { time: '8:42a',  from: 'Priya N',  ctx: 'DM',               text: 'swamped this week — can I drop the Fri coding?', urgent: true,  decline: false },
          { time: '9:15a',  from: 'Maya C',   ctx: '#rc-coord',         text: 're-slot R. Okafor onsite needed',                urgent: false, decline: false },
          { time: '10:02a', from: 'Eva K',    ctx: 'DM',               text: 'OOO Fri afternoon — sorry',                       urgent: true,  decline: false },
          { time: '11:30a', from: 'Devon P',  ctx: '#role-pretraining', text: 'HM wants Eva on debrief panel',                  urgent: false, decline: false },
          { time: '1:20p',  from: 'Marcus W', ctx: 'DM',               text: 'declining the 3pm — too short notice',            urgent: true,  decline: true  },
        ],
      },
      gcal: {
        ...FEED_META.gcal,
        items: [
          { time: '7:55a',    from: 'Theo R',         text: 'declined Tue 2pm panel · sent at 7:55a',  urgent: true,  decline: true,  afterHrs: false },
          { time: '9:00a',    from: 'L. Park onsite', text: 'block missing 1 interviewer (Eva K)',      urgent: true,  decline: false, afterHrs: false },
          { time: '10:30a',   from: 'J. Alvarez TPM', text: 'Devon P accepted',                         urgent: false, decline: false, afterHrs: false },
          { time: '2:15p',    from: 'Lin Y',          text: 'declined Fri 11am — calendar conflict',    urgent: true,  decline: true,  afterHrs: false },
          { time: 'after 6p', from: 'Marcus W',       text: 'declined invite (after hours)',            urgent: true,  decline: true,  afterHrs: true  },
        ],
      },
      ml: {
        ...FEED_META.ml,
        items: [
          { time: 'live',   from: 'REQ-2041',          ctx: 'my tasks', text: 'Sr ML panel · needs 5 interviewers · 1h old', urgent: true  },
          { time: 'live',   from: 'REQ-2035',          ctx: 'my tasks', text: 'Staff iOS · no candidate response · 2d',       urgent: true  },
          { time: '9:30a',  from: 'REQ-2039',          ctx: 'my tasks', text: 'PD phone · new request from Devon P',          urgent: false },
          { time: '11:45a', from: 'REQ-2042',          ctx: 'alerts',   text: 'RE Alignment · debrief mismatch with Gcal',    urgent: true  },
          { time: '1:00p',  from: 'Module · TS Front', ctx: 'modules',  text: 'low coverage flag (3 trained)',                urgent: false },
        ],
      },
    },
    team:         STUB_TEAM,
    interviewers: [
      { name: 'Priya Nadar',  hours: 8.5, cap: 6, sched: 12, done: 7,  kinds: { HM: 5, CD: 4, SD: 3 } },
      { name: 'David Lin',    hours: 9.0, cap: 8, sched: 11, done: 6,  kinds: { CD: 5, SD: 4, TS: 2 } },
      { name: 'Eva Kowalski', hours: 6.5, cap: 6, sched: 9,  done: 5,  kinds: { CL: 4, HM: 3, TS: 2 } },
      { name: 'James Kim',    hours: 5.0, cap: 6, sched: 7,  done: 4,  kinds: { CL: 4, TS: 3 } },
      { name: 'Sara Mendez',  hours: 4.5, cap: 6, sched: 6,  done: 3,  kinds: { TS: 4, CD: 2 } },
      { name: 'Theo Reyes',   hours: 3.0, cap: 6, sched: 4,  done: 2,  kinds: { CL: 3, HM: 1 } },
      { name: 'Lin Yamamoto', hours: 2.5, cap: 4, sched: 3,  done: 1,  kinds: { SD: 2, CD: 1 } },
      { name: 'Marcus Webb',  hours: 1.5, cap: 6, sched: 2,  done: 1,  kinds: { TS: 2 } },
    ],
    declines: STUB_DECLINES,
    queue: {
      me:      { name: 'Alex Chen', initials: 'AC' },
      partner: { name: 'Sam Reyes', initials: 'SR' },
      stats: [
        { label: 'Requests picked up',   me: 14,     them: 11,     lowerBetter: false },
        { label: 'Interviews scheduled', me: 28,     them: 24,     lowerBetter: false },
        { label: 'Confirmed',            me: 22,     them: 19,     lowerBetter: false },
        { label: 'Pending > 24h',        me: 3,      them: 5,      lowerBetter: true  },
        { label: 'Avg time-to-schedule', me: '1.2d', them: '1.6d'                     },
      ],
    },
    modules: [
      { name: 'HM Screen · ML/Research', done: 13, sched: 18, health: 'ok',    trend: [10, 14, 16, 18] },
      { name: 'Coding · Python',          done: 14, sched: 22, health: 'ok',    trend: [18, 20, 21, 22] },
      { name: 'System Design · Infra',    done: 7,  sched: 11, health: 'stale', trend: [12, 10, 9,  11] },
      { name: 'Culture · Core',           done: 9,  sched: 14, health: 'ok',    trend: [12, 13, 14, 14] },
      { name: 'Tech Screen · Frontend',   done: 6,  sched: 9,  health: 'low',   trend: [4,  6,  7,  9]  },
      { name: 'Research Take-home',       done: 3,  sched: 6,  health: 'ok',    trend: [5,  6,  5,  6]  },
    ],
    lastUpdated: null,
  };
}

// ── Feed refresh (Slack, GCal, ModernLoop) — runs every 2 minutes ────────
async function refreshFeed() {
  console.log('[server] refreshing feed sources...');

  const [gcalResult, slackResult, mlResult] = await Promise.allSettled([
    fetchGcal(),
    fetchSlack(),
    fetchModernloop(),
  ]);

  // GCal → feed.gcal.items
  if (gcalResult.status === 'fulfilled') {
    const gc = gcalResult.value;
    if (gc.gcalFeed) {
      cache.feed.gcal = { ...FEED_META.gcal, items: gc.gcalFeed };
    }
  } else {
    console.warn('[gcal] rejected:', gcalResult.reason);
  }

  // Slack → feed.slack.items
  if (slackResult.status === 'fulfilled') {
    const sl = slackResult.value;
    if (sl.slackFeed) {
      cache.feed.slack = { ...FEED_META.slack, items: sl.slackFeed };
    }
  } else {
    console.warn('[slack] rejected:', slackResult.reason);
  }

  // ModernLoop → feed.ml.items (+ kpis/interviewers/queue/modules refreshed as a bonus)
  if (mlResult.status === 'fulfilled') {
    const ml = mlResult.value;
    if (ml.kpis_ml?.length === 4) {
      cache.kpis[1] = ml.kpis_ml[0];
      cache.kpis[2] = ml.kpis_ml[1];
      cache.kpis[3] = ml.kpis_ml[2];
      cache.kpis[4] = ml.kpis_ml[3];
    }
    if (ml.mlFeed)       cache.feed.ml = { ...FEED_META.ml, items: ml.mlFeed };
    if (ml.interviewers) cache.interviewers = ml.interviewers;
    if (ml.queue)        cache.queue = ml.queue;
    if (ml.modules)      cache.modules = ml.modules;
  } else {
    console.warn('[modernloop] rejected:', mlResult.reason);
  }

  cache.lastUpdated = new Date().toISOString();
  console.log('[server] feed refresh complete', cache.lastUpdated);
}

// ── Slow refresh (Greenhouse KPIs) — runs every 5 minutes ─────────────────
async function refreshSlow() {
  console.log('[server] refreshing slow sources (Greenhouse)...');

  const [ghResult] = await Promise.allSettled([fetchGreenhouse()]);

  // Greenhouse → kpis[0]
  if (ghResult.status === 'fulfilled') {
    const gh = ghResult.value;
    if (gh.kpis?.[0]) cache.kpis[0] = gh.kpis[0];
  } else {
    console.warn('[greenhouse] rejected:', ghResult.reason);
  }

  console.log('[server] slow refresh complete');
}

// ── Full startup refresh (all sources at once) ────────────────────────────
async function refreshAll() {
  await Promise.all([refreshFeed(), refreshSlow()]);
}

// ── Express app ───────────────────────────────────────────────────────────
const app = express();

// Serve dashboard.html at the root
app.get('/', (_req, res) => {
  res.sendFile(path.resolve(rootDir, 'dashboard.html'));
});

// Full dashboard data in one payload
app.get('/api/data', (_req, res) => {
  res.json(cache);
});

// ── Startup ───────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

// Refresh all sources immediately on startup
refreshAll().catch(err => console.error('[server] initial refresh failed:', err));

// Feed sources (Slack, GCal, ModernLoop): every 2 minutes
cron.schedule('*/2 * * * *', () => {
  refreshFeed().catch(err => console.error('[server] feed cron failed:', err));
});

// Slow sources (Greenhouse KPIs): every 5 minutes
cron.schedule('*/5 * * * *', () => {
  refreshSlow().catch(err => console.error('[server] slow cron failed:', err));
});

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
