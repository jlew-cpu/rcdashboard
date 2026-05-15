import { T, KIND_LABEL } from '../tokens';
import { Chip } from './ui';
import { DECLINE_DETAIL } from '../data';

export default function DeclineOffenders() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: T.clay, letterSpacing: '-0.02em' }}>
            Decline offenders
          </h2>
          <span style={{ fontSize: '12px', color: T.muted }}>
            interviews you scheduled that they bailed on
          </span>
        </div>
        <Chip color={T.muted} bg={T.surfaceAlt} size="xs">last 30d · &gt;25% rate</Chip>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {DECLINE_DETAIL.map((d, i) => (
          <div key={i} style={{
            background: T.warnBgLight,
            border: `1px solid ${T.clayLight}`,
            borderLeft: `3px solid ${T.clay}`,
            borderRadius: T.rLg,
            padding: '12px 14px',
          }}>
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: T.slate }}>
                  {d.name}
                </span>
                <span style={{ fontSize: '22px', fontWeight: 800, color: T.red, lineHeight: 1, letterSpacing: '-0.02em' }}>
                  {d.rate}%
                </span>
                <span style={{ fontSize: '12px', color: T.muted }}>
                  {d.count} of {d.total} declined · {d.period}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <button style={{
                  padding: '4px 10px',
                  borderRadius: T.rFull,
                  border: `1px solid ${T.slate}`,
                  background: T.surface,
                  color: T.slate,
                  fontSize: '11px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}>
                  Ping in Slack
                </button>
                <button style={{
                  padding: '4px 10px',
                  borderRadius: T.rFull,
                  border: `1px solid ${T.border}`,
                  background: T.surface,
                  color: T.muted,
                  fontSize: '11px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}>
                  Remove from pool
                </button>
              </div>
            </div>

            <p style={{ margin: '0 0 10px', fontSize: '12px', color: T.muted, fontStyle: 'italic' }}>
              "{d.note}"
            </p>

            {/* Incidents table */}
            <div style={{
              borderTop: `1px solid ${T.clayLight}60`,
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '76px 90px 1fr 140px',
                gap: '8px',
                padding: '5px 0 3px',
                fontSize: '10px',
                fontWeight: 600,
                color: T.mutedLight,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                borderBottom: `1px solid ${T.clayLight}40`,
              }}>
                <span>Date</span>
                <span>Kind</span>
                <span>Candidate</span>
                <span style={{ textAlign: 'right' }}>Outcome</span>
              </div>

              {d.incidents.map((it, j) => (
                <div key={j} style={{
                  display: 'grid',
                  gridTemplateColumns: '76px 90px 1fr 140px',
                  gap: '8px',
                  padding: '5px 0',
                  fontSize: '12px',
                  borderBottom: j < d.incidents.length - 1 ? `1px solid ${T.clayLight}30` : 'none',
                  alignItems: 'center',
                }}>
                  <span style={{ color: T.muted, fontVariantNumeric: 'tabular-nums' }}>{it.date}</span>
                  <span style={{ display: 'inline-flex' }}>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      padding: '2px 6px',
                      borderRadius: T.rSm,
                      background: T.surfaceAlt,
                      border: `1px solid ${T.borderMed}`,
                      color: T.slate,
                      whiteSpace: 'nowrap',
                    }}>
                      {KIND_LABEL[it.kind]}
                    </span>
                  </span>
                  <span style={{ fontWeight: 500, color: T.slate }}>{it.cand}</span>
                  <span style={{
                    textAlign: 'right',
                    color: it.outcome.includes('lost') ? T.red : T.muted,
                    fontWeight: it.outcome.includes('lost') ? 600 : 400,
                    fontSize: '11.5px',
                  }}>
                    {it.outcome}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
