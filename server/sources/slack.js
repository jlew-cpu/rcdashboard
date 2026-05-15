// server/sources/slack.js
// Slack Web API data source.
// Env vars: SLACK_BOT_TOKEN (Bot User OAuth Token)
// Required bot scopes: channels:history, im:history, im:read, users:read
// Note: search.messages requires a user-level token — NOT used here.

const STUB_ITEMS = [
  { time: '8:42a',  from: 'Priya N',  ctx: 'DM',               text: 'swamped this week — can I drop the Fri coding?', urgent: true,  decline: false },
  { time: '9:15a',  from: 'Maya C',   ctx: '#rc-coord',         text: 're-slot R. Okafor onsite needed',                urgent: false, decline: false },
  { time: '10:02a', from: 'Eva K',    ctx: 'DM',               text: 'OOO Fri afternoon — sorry',                       urgent: true,  decline: false },
  { time: '11:30a', from: 'Devon P',  ctx: '#role-pretraining', text: 'HM wants Eva on debrief panel',                  urgent: false, decline: false },
  { time: '1:20p',  from: 'Marcus W', ctx: 'DM',               text: 'declining the 3pm — too short notice',            urgent: true,  decline: true  },
];

const DECLINE_KEYWORDS = ['declin', 'drop', 'cancel', 'OOO', 'out of office', 'can\'t make', 'cannot make'];

export async function fetchSlack() {
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) {
    return { slackFeed: STUB_ITEMS };
  }

  try {
    const { WebClient } = await import('@slack/web-api');
    const client = new WebClient(token);

    // Fetch DM (im) channels
    const imList = await client.conversations.list({ types: 'im', limit: 20 });
    const dmChannels = (imList.channels || []).slice(0, 10);

    // Fetch recent messages from each DM
    const items = [];
    const now = new Date();
    const startOfDay = Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000);

    // Build user id -> name map from DM channels (parallel to reduce latency)
    const userIds = dmChannels.map(c => c.user).filter(Boolean);
    const userMap = {};
    const userInfoResults = await Promise.all(
      userIds.map(uid =>
        client.users.info({ user: uid }).catch(() => null)
      )
    );
    userIds.forEach((uid, idx) => {
      const info = userInfoResults[idx];
      const profile = info?.user?.profile;
      const name = profile?.real_name_normalized || profile?.real_name || profile?.display_name || uid;
      userMap[uid] = name;
    });

    for (const chan of dmChannels) {
      try {
        const hist = await client.conversations.history({
          channel: chan.id,
          oldest: String(startOfDay),
          limit: 10,
        });
        const msgs = hist.messages || [];
        for (const msg of msgs.slice(0, 3)) {
          const text    = msg.text || '';
          const isDecline = DECLINE_KEYWORDS.some(kw => text.toLowerCase().includes(kw.toLowerCase()));
          const isUrgent  = isDecline || text.toLowerCase().includes('urgent') || text.toLowerCase().includes('ooo');
          const userName  = userMap[chan.user] || 'User';
          // Shorten to first/last initial
          const parts = userName.split(' ');
          const shortName = parts.length >= 2
            ? `${parts[0]} ${parts[parts.length - 1][0]}.`
            : userName;

          items.push({
            _ts:     parseFloat(msg.ts),
            time:    formatSlackTime(msg.ts),
            from:    shortName,
            ctx:     'DM',
            text:    text.slice(0, 100),
            urgent:  isUrgent,
            decline: isDecline,
          });
        }
      } catch {
        // skip channels we can't read
      }
    }

    if (items.length === 0) {
      return { slackFeed: STUB_ITEMS };
    }

    // Sort by timestamp descending and take top 5
    items.sort((a, b) => b._ts - a._ts);
    return { slackFeed: items.slice(0, 5) };
  } catch (err) {
    console.warn('[slack] fetch failed, using stub:', err.message);
    return { slackFeed: STUB_ITEMS };
  }
}

function formatSlackTime(ts) {
  if (!ts) return '';
  const date = new Date(parseFloat(ts) * 1000);
  let h = date.getHours();
  const m = date.getMinutes();
  const ampm = h >= 12 ? 'p' : 'a';
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, '0')}${ampm}`;
}
