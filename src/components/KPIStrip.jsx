import { T } from '../tokens';
import { KPIS } from '../data';

export default function KPIStrip() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '10px',
    }}>
      {KPIS.map((kpi, i) => (
        <div
          key={i}
          style={{
            background: kpi.warn ? T.warnBgLight : T.surface,
            border: `1px solid ${kpi.warn ? T.clayLight : T.border}`,
            borderRadius: T.rLg,
            padding: '14px 16px',
            cursor: 'default',
            transition: 'border-color 0.15s',
          }}
          onMouseOver={e => e.currentTarget.style.borderColor = kpi.warn ? T.clay : T.borderMed}
          onMouseOut={e => e.currentTarget.style.borderColor = kpi.warn ? T.clayLight : T.border}
        >
          <div style={{
            fontSize: '11px',
            fontWeight: 500,
            color: kpi.warn ? T.clay : T.muted,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}>
            {kpi.label}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{
              fontSize: '32px',
              fontWeight: 700,
              color: kpi.warn ? T.clay : T.slate,
              lineHeight: 1,
              letterSpacing: '-0.03em',
            }}>
              {kpi.value}
            </span>
            <span style={{ fontSize: '11px', color: kpi.warn ? T.clay : T.muted, fontWeight: 400 }}>
              {kpi.note}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
