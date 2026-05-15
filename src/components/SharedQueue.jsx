import { T } from '../tokens';
import { Avatar } from './ui';
import { SHARED_QUEUE } from '../data';

export default function SharedQueue() {
  const { me, partner, period, stats } = SHARED_QUEUE;

  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: T.rLg,
      padding: '14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: T.slate, letterSpacing: '-0.01em' }}>
          Shared queue · me vs {partner.name}
        </h3>
        <span style={{ fontSize: '11px', color: T.muted }}>{period}</span>
      </div>

      <div style={{ height: 1, background: T.border, marginBottom: '10px' }}/>

      {/* Avatar row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 80px 80px',
        gap: '8px',
        marginBottom: '4px',
      }}>
        <span/>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
          <Avatar initials={me.initials} size={20} kind="recruiter"/>
          <span style={{ fontSize: '11px', color: T.muted, fontWeight: 500 }}>me</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
          <Avatar initials={partner.initials} size={20} kind="sourcer"/>
          <span style={{ fontSize: '11px', color: T.muted, fontWeight: 500 }}>{partner.name.split(' ')[0]}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {stats.map((s, i) => {
          const meNum = typeof s.me === 'number' ? s.me : null;
          const themNum = typeof s.them === 'number' ? s.them : null;
          const meBetter = meNum !== null && themNum !== null && (s.lowerBetter ? meNum < themNum : meNum > themNum);
          const themBetter = meNum !== null && themNum !== null && (s.lowerBetter ? themNum < meNum : themNum > meNum);

          return (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 80px 80px',
              gap: '8px',
              alignItems: 'center',
              padding: '5px 0',
              borderBottom: i < stats.length - 1 ? `1px solid ${T.border}` : 'none',
            }}>
              <span style={{ fontSize: '12px', color: T.slate }}>{s.k}</span>
              <span style={{
                textAlign: 'center',
                fontSize: '18px',
                fontWeight: 700,
                color: meBetter ? T.olive : T.slate,
                fontVariantNumeric: 'tabular-nums',
                background: meBetter ? T.oliveBg : 'transparent',
                borderRadius: T.rSm,
                padding: meBetter ? '1px 4px' : '0',
              }}>
                {s.me}
              </span>
              <span style={{
                textAlign: 'center',
                fontSize: '18px',
                fontWeight: 700,
                color: themBetter ? T.olive : T.slate,
                fontVariantNumeric: 'tabular-nums',
                background: themBetter ? T.oliveBg : 'transparent',
                borderRadius: T.rSm,
                padding: themBetter ? '1px 4px' : '0',
              }}>
                {s.them}
              </span>
            </div>
          );
        })}
      </div>

      <p style={{ margin: '10px 0 0', fontSize: '11px', color: T.mutedLight, fontStyle: 'italic' }}>
        Friendly scoreboard · not a leaderboard
      </p>
    </div>
  );
}
