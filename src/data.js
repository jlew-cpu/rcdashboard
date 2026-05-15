export const TODAY_LABEL = 'Wed · May 15, 2026';

export const TOOLS = [
  { name: 'Greenhouse', short: 'GH',  kind: 'olive', url: 'https://app.greenhouse.io' },
  { name: 'ModernLoop', short: 'ML',  kind: 'clay',  url: 'https://app.modernloop.io' },
  { name: 'Gcal',       short: 'Cal', kind: 'sky',   url: 'https://calendar.google.com' },
  { name: 'Inbox',      short: '@',   kind: 'fig',   url: 'https://mail.google.com' },
  { name: 'Slack',      short: '#',   kind: 'heather', url: 'https://slack.com' },
];

export const KPIS = [
  { label: 'Open roles',         value: '23', note: 'across 5 functions',  warn: false },
  { label: 'Scheduled · week',   value: '28', note: 'vs. Sam: 24',         warn: false },
  { label: 'Queue (mine)',        value: '14', note: '3 over 24h',          warn: true  },
  { label: 'Debrief mismatches', value: '3',  note: 'needs fix',           warn: true  },
  { label: 'Decline offenders',  value: '3',  note: '>25% rate',           warn: true  },
];

export const DAILY_FEED = {
  slack: [
    { time: '8:42a', from: 'Priya N',  type: 'DM',             text: 'swamped this week — can I drop the Fri coding?', urgent: true,  decline: false },
    { time: '9:15a', from: 'Maya C',   type: '#rc-coord',       text: 're-slot R. Okafor onsite needed',                urgent: false, decline: false },
    { time: '10:02a', from: 'Eva K',   type: 'DM',             text: 'OOO Fri afternoon — sorry',                       urgent: true,  decline: false },
    { time: '11:30a', from: 'Devon P', type: '#role-pretraining', text: 'HM wants Eva on debrief panel',                urgent: false, decline: false },
    { time: '1:20p',  from: 'Marcus W', type: 'DM',            text: 'declining the 3pm — too short notice',            urgent: true,  decline: true  },
  ],
  gcal: [
    { time: '7:55a',  who: 'Theo R',          text: 'declined Tue 2pm panel · sent at 7:55a',       urgent: true,  decline: true,  afterHours: false },
    { time: '9:00a',  who: 'L. Park onsite',  text: 'block missing 1 interviewer (Eva K)',           urgent: true,  decline: false, afterHours: false },
    { time: '10:30a', who: 'J. Alvarez TPM',  text: 'Devon P accepted',                              urgent: false, decline: false, afterHours: false },
    { time: '2:15p',  who: 'Lin Y',           text: 'declined Fri 11am — calendar conflict',         urgent: true,  decline: true,  afterHours: false },
    { time: 'after 6p', who: 'Marcus W',      text: 'declined invite (after hours)',                 urgent: true,  decline: true,  afterHours: true  },
  ],
  ml: [
    { time: 'live',  who: 'REQ-2041', text: 'Sr ML panel · needs 5 interviewers · 1h old',     urgent: true,  tab: 'my tasks'  },
    { time: 'live',  who: 'REQ-2035', text: 'Staff iOS · no candidate response · 2d',           urgent: true,  tab: 'my tasks'  },
    { time: '9:30a', who: 'REQ-2039', text: 'PD phone · new request from Devon P',              urgent: false, tab: 'my tasks'  },
    { time: '11:45a', who: 'REQ-2042', text: 'RE Alignment · debrief mismatch with Gcal',       urgent: true,  tab: 'alerts'    },
    { time: '1:00p',  who: 'Module · TS Frontend', text: 'low coverage flag (3 trained)',        urgent: false, tab: 'modules'   },
  ],
};

export const TEAM_CANDIDATES = [
  {
    name: 'Maya Chen', kind: 'recruiter', initials: 'MC',
    focus: 'Research + ML · 7 roles',
    candidates: [
      { name: 'R. Okafor',  role: 'Sr ML Engineer, Pretraining',  stage: 'Onsite' },
      { name: 'L. Park',    role: 'Research Engineer, Alignment', stage: 'Final'  },
      { name: 'S. Vora',    role: 'MoTS, RL',                     stage: 'Phone'  },
      { name: 'J. Patel',   role: 'Security Engineer',            stage: 'Phone'  },
    ],
  },
  {
    name: 'Devon Park', kind: 'recruiter', initials: 'DP',
    focus: 'Product Eng + Design · 6 roles',
    candidates: [
      { name: 'J. Alvarez', role: 'TPM, Model Deployment',        stage: 'Onsite' },
      { name: 'M. Singh',   role: 'Sr Frontend, claude.ai',       stage: 'Onsite' },
      { name: 'K. Liu',     role: 'Product Designer, Claude',     stage: 'Phone'  },
      { name: 'T. Adeyemi', role: 'Staff iOS Engineer',           stage: 'Onsite' },
    ],
  },
  {
    name: 'Ananya Rao', kind: 'sourcer', initials: 'AR',
    focus: 'Research scientists · 142 pipeline',
    candidates: [
      { name: 'H. Tanaka',  role: 'Research Scientist, Interp',   stage: 'Source'   },
      { name: 'P. Iyer',    role: 'Research Engineer, Alignment', stage: 'Outreach' },
      { name: 'N. Schmidt', role: 'Sr ML Engineer, Pretraining',  stage: 'Outreach' },
    ],
  },
  {
    name: 'Marco Silva', kind: 'sourcer', initials: 'MS',
    focus: 'Infra + Security · 98 pipeline',
    candidates: [
      { name: 'D. Park',     role: 'Security Engineer',           stage: 'Source'   },
      { name: 'R. Banerjee', role: 'Infra SWE, Inference',        stage: 'Outreach' },
    ],
  },
  {
    name: 'Jules Bennett', kind: 'sourcer', initials: 'JB',
    focus: 'Product + Design · 121 pipeline',
    candidates: [
      { name: 'C. Mendoza', role: 'Product Designer, Claude',     stage: 'Outreach' },
      { name: 'F. Akhtar',  role: 'Brand Designer',               stage: 'Source'   },
      { name: 'G. Wu',      role: 'Sr Frontend, claude.ai',       stage: 'Outreach' },
    ],
  },
];

export const INTERVIEWERS = [
  { name: 'Priya Nadar',  hours: 8.5, cap: 6,  sched: 12, completed: 7,  kinds: { HM: 5, CD: 4, SD: 3 } },
  { name: 'David Lin',    hours: 9.0, cap: 8,  sched: 11, completed: 6,  kinds: { CD: 5, SD: 4, TS: 2 } },
  { name: 'Eva Kowalski', hours: 6.5, cap: 6,  sched:  9, completed: 5,  kinds: { CL: 4, HM: 3, TS: 2 } },
  { name: 'James Kim',    hours: 5.0, cap: 6,  sched:  7, completed: 4,  kinds: { CL: 4, TS: 3 } },
  { name: 'Sara Mendez',  hours: 4.5, cap: 6,  sched:  6, completed: 3,  kinds: { TS: 4, CD: 2 } },
  { name: 'Theo Reyes',   hours: 3.0, cap: 6,  sched:  4, completed: 2,  kinds: { CL: 3, HM: 1 } },
  { name: 'Lin Yamamoto', hours: 2.5, cap: 4,  sched:  3, completed: 1,  kinds: { SD: 2, CD: 1 } },
  { name: 'Marcus Webb',  hours: 1.5, cap: 6,  sched:  2, completed: 1,  kinds: { TS: 2 } },
];

export const DECLINE_DETAIL = [
  {
    name: 'Marcus Webb', rate: 42, count: 23, total: 55, period: 'last 30d',
    note: 'Often "not enough notice"',
    incidents: [
      { cand: 'R. Okafor',  kind: 'TS', date: 'May 12', outcome: 'rescheduled (3d slip)' },
      { cand: 'K. Liu',     kind: 'TS', date: 'May 8',  outcome: 'lost slot' },
      { cand: 'J. Alvarez', kind: 'HM', date: 'May 5',  outcome: 'rescheduled' },
      { cand: 'T. Adeyemi', kind: 'CD', date: 'Apr 30', outcome: 'lost slot' },
    ],
  },
  {
    name: 'Lin Yamamoto', rate: 38, count: 18, total: 47, period: 'last 30d',
    note: 'Declines Fri afternoons',
    incidents: [
      { cand: 'M. Singh',   kind: 'SD', date: 'May 10', outcome: 'rescheduled' },
      { cand: 'S. Vora',    kind: 'SD', date: 'May 3',  outcome: 'lost slot' },
      { cand: 'L. Park',    kind: 'CD', date: 'Apr 26', outcome: 'rescheduled' },
    ],
  },
  {
    name: 'Theo Reyes', rate: 35, count: 14, total: 40, period: 'last 30d',
    note: 'Calendar conflicts (recurring 1:1)',
    incidents: [
      { cand: 'R. Okafor', kind: 'CL', date: 'May 13', outcome: 'rescheduled today' },
      { cand: 'H. Tanaka', kind: 'CL', date: 'May 6',  outcome: 'rescheduled' },
    ],
  },
];

export const SHARED_QUEUE = {
  partner: { name: 'Sam Reyes', initials: 'SR' },
  me:      { name: 'Alex Chen', initials: 'AC' },
  period:  'this week',
  stats: [
    { k: 'Requests picked up',   me: 14,    them: 11,    lowerBetter: false },
    { k: 'Interviews scheduled', me: 28,    them: 24,    lowerBetter: false },
    { k: 'Confirmed',            me: 22,    them: 19,    lowerBetter: false },
    { k: 'Pending > 24h',        me:  3,    them:  5,    lowerBetter: true  },
    { k: 'Avg time-to-schedule', me: '1.2d', them: '1.6d', isText: true },
  ],
};

export const ML_MODULES = [
  { name: 'HM Screen · ML/Research',  sched: 18, done: 13, owner: 'Maya C',  health: 'ok',    trend: [10, 14, 16, 18] },
  { name: 'Coding · Python',           sched: 22, done: 14, owner: 'Devon P', health: 'ok',    trend: [18, 20, 21, 22] },
  { name: 'System Design · Infra',     sched: 11, done:  7, owner: 'Devon P', health: 'stale', trend: [12, 10,  9, 11], note: 'rubric updated 6mo ago' },
  { name: 'Culture · Core',            sched: 14, done:  9, owner: 'Maya C',  health: 'ok',    trend: [12, 13, 14, 14] },
  { name: 'Tech Screen · Frontend',    sched:  9, done:  6, owner: 'Devon P', health: 'low',   trend: [ 4,  6,  7,  9], note: 'only 3 trained' },
  { name: 'Research Take-home',        sched:  6, done:  3, owner: 'Maya C',  health: 'ok',    trend: [ 5,  6,  5,  6] },
  { name: 'Debrief · Engineering',     sched:  8, done:  5, owner: 'Maya C',  health: 'ok',    trend: [ 7,  8,  8,  8] },
  { name: 'Hiring Comm · Design',      sched:  3, done:  1, owner: 'Devon P', health: 'new',   trend: [ 0,  1,  2,  3] },
];

export const HEALTH = {
  ok:    { label: 'Healthy',       color: '#5C6B3A' },
  stale: { label: 'Stale rubric',  color: '#D97757' },
  low:   { label: 'Low coverage',  color: '#D97757' },
  new:   { label: 'New',           color: '#7B5EA7' },
};
