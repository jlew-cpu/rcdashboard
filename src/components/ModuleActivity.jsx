import { T } from '../tokens';
import { Sparkline } from './ui';
import { ML_MODULES, HEALTH } from '../data';

export default function ModuleActivity() {
  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: T.rLg,
      padding: '14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: T.slate, letterSpacing: '-0.01em' }}>
          Module activity
        </h3>
        <span style={{ fontSize: '11px', color: T.muted }}>4-week trend</span>
      </div>

      <div style={{ height: 1, background: T.border, marginBottom: '10px' }}/>

      {/* Column headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 52px 80px 90px',
        gap: '8px',
        padding: '0 0 4px',
        fontSize: '10px',
        fontWeight: 600,
        color: T.mutedLight,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        borderBottom: `1px solid ${T.border}`,
        marginBottom: '4px',
      }}>
        <span>Module</span>
        <span style={{ textAlign: 'right' }}>Done/sched</span>
        <span style={{ textAlign: 'center' }}>4-wk trend</span>
        <span style={{ textAlign: 'right' }}>Health</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {ML_MODULES.slice(0, 6).map((m, i) => {
          const health = HEALTH[m.health];
          return (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 52px 80px 90px',
              gap: '8px',
              alignItems: 'center',
              padding: '6px 0',
              borderBottom: i < 5 ? `1px solid ${T.border}` : 'none',
            }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 500,
                color: T.slate,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }} title={m.name}>
                {m.name}
              </span>

              <span style={{ textAlign: 'right', fontSize: '12px', fontVariantNumeric: 'tabular-nums' }}>
                <b style={{ color: T.slate }}>{m.done}</b>
                <span style={{ color: T.muted }}>/{m.sched}</span>
              </span>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Sparkline
                  values={m.trend}
                  color={health.color}
                  width={72}
                  height={20}
                />
              </div>

              <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '4px' }}>
                <span style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: health.color,
                  flexShrink: 0,
                }}/>
                <span style={{ fontSize: '11px', color: health.color, fontWeight: 500 }}>
                  {health.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
