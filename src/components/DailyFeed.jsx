import { useState } from 'react';
import { T } from '../tokens';
import { Chip } from './ui';
import { DAILY_FEED } from '../data';

const SOURCE_META = {
  slack: {
    label: 'Slack',
    short: '#',
    color: T.heather,
    bg: T.heatherBg,
    border: '#C4A8E0',
    sub: 'DMs · channels · pings',
  },
  gcal: {
    label: 'Google Calendar',
    short: 'Cal',
    color: T.sky,
    bg: T.skyBg,
    border: '#A0BFE8',
    sub: 'RSVPs · declines · after-hours',
  },
  ml: {
    label: 'ModernLoop',
    short: 'ML',
    color: T.clay,
    bg: T.warnBg,
    border: T.clayLight,
    sub: 'My tasks · alerts · queue',
  },
};

const FILTERS = ['today', '+ yesterday', 'after-hours only', 'declines only', 'urgent only'];

function FeedItem({ item, srcColor }) {
  const isUrgent = item.urgent;
  return (
    <div style={{
      borderRadius: T.rMd,
      border: `1px solid ${isUrgent ? T.clayLight : T.border}`,
      borderLeft: `3px solid ${isUrgent ? T.clay : srcColor}`,
      background: isUrgent ? T.warnBgLight : T.surface,
      padding: '8px 10px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: T.slate }}>
          {item.from || item.who}
          {item.type && <span style={{ color: T.muted, fontWeight: 400 }}> · {item.type}</span>}
          {item.tab && <span style={{ color: T.muted, fontWeight: 400 }}> · {item.tab}</span>}
        </span>
        <span style={{ fontSize: '11px', color: T.mutedLight, whiteSpace: 'nowrap', flexShrink: 0 }}>
          {item.time}
        </span>
      </div>
      <p style={{ margin: '3px 0 0', fontSize: '12px', color: T.slate, lineHeight: 1.4 }}>
        {item.text}
      </p>
      {(item.decline || item.afterHours || item.urgent) && (
        <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
          {item.decline && (
            <Chip color={T.clay} bg={T.warnBg} size="xs">decline</Chip>
          )}
          {item.afterHours && (
            <Chip color={T.muted} bg={T.surfaceAlt} size="xs">after hrs</Chip>
          )}
          {item.urgent && (
            <Chip color={T.clay} bg={T.warnBg} size="xs">action needed</Chip>
          )}
        </div>
      )}
    </div>
  );
}

function FeedColumn({ src }) {
  const meta = SOURCE_META[src];
  const items = DAILY_FEED[src];
  const urgentCount = items.filter(i => i.urgent).length;

  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: T.rLg,
      padding: '14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '0',
    }}>
      {/* Column header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: meta.bg,
            border: `1.5px solid ${meta.border}`,
            color: meta.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 700,
            flexShrink: 0,
          }}>
            {meta.short}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: T.slate, lineHeight: 1.2 }}>
              {meta.label}
            </div>
            <div style={{ fontSize: '11px', color: T.mutedLight, lineHeight: 1.2 }}>
              {meta.sub}
            </div>
          </div>
        </div>
        {urgentCount > 0 && (
          <Chip color={T.clay} bg={T.warnBg} size="xs">
            {urgentCount} urgent
          </Chip>
        )}
      </div>

      <div style={{ height: 1, background: T.border, marginBottom: '10px' }}/>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {items.map((item, i) => (
          <FeedItem key={i} item={item} srcColor={meta.color}/>
        ))}
      </div>
    </div>
  );
}

export default function DailyFeed() {
  const [activeFilter, setActiveFilter] = useState('today');

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: T.slate, letterSpacing: '-0.02em' }}>
          What needs me today
        </h2>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: '4px 10px',
                borderRadius: T.rFull,
                border: `1px solid ${activeFilter === f ? T.slate : T.border}`,
                background: activeFilter === f ? T.slate : T.surface,
                color: activeFilter === f ? T.ivory : T.muted,
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.1s',
                fontFamily: 'inherit',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
        <FeedColumn src="slack"/>
        <FeedColumn src="gcal"/>
        <FeedColumn src="ml"/>
      </div>
    </div>
  );
}
