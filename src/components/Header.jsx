import { T } from '../tokens';
import { ToolButton } from './ui';
import { TODAY_LABEL, TOOLS } from '../data';

export default function Header() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 32px 16px',
      borderBottom: `1px solid ${T.border}`,
      background: T.ivory,
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <div>
        <h1 style={{
          margin: 0,
          fontSize: '22px',
          fontWeight: 700,
          color: T.slate,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
        }}>
          RC Dashboard
        </h1>
        <p style={{
          margin: '3px 0 0',
          fontSize: '13px',
          color: T.muted,
          fontWeight: 400,
        }}>
          <span style={{ color: T.slate, fontWeight: 500 }}>{TODAY_LABEL}</span>
          {' · paired w/ Sam R · 2 recruiters · 3 sourcers · 23 open roles · 58 interviewers'}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '12px', color: T.mutedLight, fontWeight: 400 }}>
          jump to
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {TOOLS.map(t => <ToolButton key={t.name} tool={t}/>)}
        </div>
      </div>
    </div>
  );
}
