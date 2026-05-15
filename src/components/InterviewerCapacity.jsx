import { T, KIND_COLORS, KIND_BG, KIND_LABEL } from '../tokens';
import { KindLegend } from './ui';
import { INTERVIEWERS } from '../data';

export default function InterviewerCapacity() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: T.slate, letterSpacing: '-0.02em' }}>
            Interviewer capacity
          </h2>
          <span style={{ fontSize: '12px', color: T.muted }}>
            this week · what they're doing, not just hours
          </span>
        </div>
        <KindLegend/>
      </div>

      <div style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: T.rLg,
        overflow: 'hidden',
      }}>
        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '160px 60px 90px 1fr 80px',
          gap: '12px',
          padding: '8px 16px',
          background: T.surfaceAlt,
          borderBottom: `1px solid ${T.border}`,
          fontSize: '11px',
          fontWeight: 600,
          color: T.muted,
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
        }}>
          <span>Interviewer</span>
          <span style={{ textAlign: 'right' }}>This wk</span>
          <span style={{ textAlign: 'right' }}>Hrs / cap</span>
          <span>Kind breakdown · this week</span>
          <span style={{ textAlign: 'right' }}>Done / sched</span>
        </div>

        {INTERVIEWERS.map((iv, i) => {
          const over = iv.hours > iv.cap;
          const thisWeekTotal = Object.values(iv.kinds).reduce((a, b) => a + b, 0);
          return (
            <div
              key={iv.name}
              style={{
                display: 'grid',
                gridTemplateColumns: '160px 60px 90px 1fr 80px',
                gap: '12px',
                padding: '10px 16px',
                alignItems: 'center',
                borderBottom: i < INTERVIEWERS.length - 1 ? `1px solid ${T.border}` : 'none',
                background: T.surface,
                transition: 'background 0.1s',
                cursor: 'default',
              }}
              onMouseOver={e => e.currentTarget.style.background = T.surfaceAlt}
              onMouseOut={e => e.currentTarget.style.background = T.surface}
            >
              <span style={{ fontSize: '13px', fontWeight: 500, color: T.slate }}>
                {iv.name}
              </span>

              <span style={{ textAlign: 'right', fontSize: '16px', fontWeight: 700, color: T.slate, fontVariantNumeric: 'tabular-nums' }}>
                {thisWeekTotal}
              </span>

              <div style={{ textAlign: 'right' }}>
                <span style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: over ? T.red : T.slate,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {iv.hours}h
                </span>
                <span style={{ fontSize: '11px', color: T.muted }}>/{iv.cap}</span>
                {over && (
                  <span style={{
                    marginLeft: '4px',
                    fontSize: '10px',
                    color: T.red,
                    fontWeight: 600,
                  }}>over</span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {Object.entries(iv.kinds).map(([k, v]) => (
                  <span key={k} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 7px',
                    borderRadius: T.rSm,
                    background: KIND_BG[k],
                    border: `1px solid ${KIND_COLORS[k]}30`,
                    fontSize: '11px',
                    color: T.slate,
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                  }}>
                    {KIND_LABEL[k]}
                    <b style={{ color: KIND_COLORS[k] }}>{v}</b>
                  </span>
                ))}
              </div>

              <span style={{
                textAlign: 'right',
                fontSize: '12px',
                color: T.muted,
                fontVariantNumeric: 'tabular-nums',
              }}>
                <span style={{ fontWeight: 600, color: T.slate }}>{iv.completed}</span>
                /{iv.sched}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
