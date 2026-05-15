// Shared UI primitives
import { T, KIND_COLORS, KIND_BG, KIND_LABEL } from '../tokens';

export function Card({ children, style = {}, warn = false }) {
  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${warn ? T.clay : T.border}`,
      borderRadius: T.rLg,
      padding: '16px',
      ...style,
    }}>
      {children}
    </div>
  );
}

export function SectionHeader({ children, subtitle, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '12px' }}>
      <div>
        <span style={{ fontSize: '14px', fontWeight: 600, color: T.slate, letterSpacing: '-0.01em' }}>
          {children}
        </span>
        {subtitle && (
          <span style={{ fontSize: '12px', color: T.muted, marginLeft: '8px' }}>
            {subtitle}
          </span>
        )}
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}

export function Chip({ children, color = T.muted, bg, size = 'sm', style = {} }) {
  const fontSize = size === 'xs' ? '11px' : '12px';
  const padding = size === 'xs' ? '2px 6px' : '3px 8px';
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '3px',
      padding,
      borderRadius: T.rFull,
      border: `1px solid ${color}`,
      background: bg || 'transparent',
      color,
      fontSize,
      fontWeight: 500,
      lineHeight: 1.2,
      whiteSpace: 'nowrap',
      ...style,
    }}>
      {children}
    </span>
  );
}

export function Avatar({ initials, size = 28, kind = 'recruiter' }) {
  const bg = kind === 'recruiter' ? T.warnBg : T.oliveBg;
  const color = kind === 'recruiter' ? T.clay : T.olive;
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: bg,
      border: `1.5px solid ${color}`,
      color,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.38,
      fontWeight: 700,
      flexShrink: 0,
      letterSpacing: '-0.02em',
    }}>
      {initials}
    </div>
  );
}

export function ToolButton({ tool }) {
  const colorMap = {
    olive:   { bg: T.oliveBg,   color: T.olive   },
    clay:    { bg: T.warnBg,    color: T.clay    },
    sky:     { bg: T.skyBg,     color: T.sky     },
    fig:     { bg: T.figBg,     color: T.fig     },
    heather: { bg: T.heatherBg, color: T.heather },
  };
  const c = colorMap[tool.kind] || { bg: '#F0EFED', color: T.muted };
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      title={tool.name}
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: c.bg,
        border: `1.5px solid ${c.color}`,
        color: c.color,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        fontWeight: 700,
        textDecoration: 'none',
        flexShrink: 0,
        transition: 'opacity 0.1s',
        cursor: 'pointer',
      }}
      onMouseOver={e => e.currentTarget.style.opacity = '0.75'}
      onMouseOut={e => e.currentTarget.style.opacity = '1'}
    >
      {tool.short}
    </a>
  );
}

export function KindBadge({ kind, count }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '2px 7px',
      borderRadius: T.rSm,
      background: KIND_BG[kind],
      border: `1px solid ${KIND_COLORS[kind]}40`,
      fontSize: '11px',
      color: T.slate,
      fontWeight: 500,
      whiteSpace: 'nowrap',
    }}>
      {KIND_LABEL[kind]}
      {count !== undefined && (
        <b style={{ color: KIND_COLORS[kind], fontWeight: 700 }}>{count}</b>
      )}
    </span>
  );
}

export function KindLegend() {
  const kinds = ['HM', 'TS', 'CD', 'SD', 'CL'];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
      {kinds.map(k => (
        <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: T.muted }}>
          <span style={{ width: 8, height: 8, borderRadius: '2px', background: KIND_COLORS[k], flexShrink: 0 }}/>
          {KIND_LABEL[k]}
        </span>
      ))}
    </div>
  );
}

export function Divider({ style = {} }) {
  return <div style={{ height: 1, background: T.border, margin: '12px 0', ...style }}/>;
}

export function Sparkline({ values, color = T.slate, width = 80, height = 20 }) {
  if (!values || values.length < 2) return null;
  const max = Math.max(...values, 1);
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - 2 - (v / max) * (height - 4);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <svg width={width} height={height} style={{ display: 'block', flexShrink: 0 }}>
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
