import { T } from '../tokens';
import { Avatar, Chip } from './ui';
import { TEAM_CANDIDATES } from '../data';

const STAGE_COLOR = {
  Onsite:   { color: T.clay,    bg: T.warnBg    },
  Final:    { color: T.olive,   bg: T.oliveBg   },
  Phone:    { color: T.sky,     bg: T.skyBg     },
  Source:   { color: T.fig,     bg: T.figBg     },
  Outreach: { color: T.muted,   bg: T.surfaceAlt },
};

function PersonCard({ person }) {
  const isRecruiter = person.kind === 'recruiter';
  const accentColor = isRecruiter ? T.clay : T.olive;
  const borderColor = isRecruiter ? T.clayLight : `${T.oliveLight}80`;

  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${borderColor}`,
      borderTop: `3px solid ${accentColor}`,
      borderRadius: T.rLg,
      padding: '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      {/* Card header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <Avatar initials={person.initials} size={30} kind={person.kind}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: T.slate, lineHeight: 1.2 }}>
            {person.name}
          </div>
          <div style={{ fontSize: '10px', color: T.muted, lineHeight: 1.3, marginTop: '1px' }}>
            {person.kind} · {person.focus}
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: T.border }}/>

      {/* Candidates */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {person.candidates.map((c, i) => {
          const stageMeta = STAGE_COLOR[c.stage] || STAGE_COLOR.Outreach;
          return (
            <div key={i} style={{
              padding: '5px 0',
              borderBottom: i < person.candidates.length - 1 ? `1px dashed ${T.border}` : 'none',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: T.slate }}>{c.name}</span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  color: stageMeta.color,
                  background: stageMeta.bg,
                  padding: '1px 5px',
                  borderRadius: T.rSm,
                  flexShrink: 0,
                }}>
                  {c.stage}
                </span>
              </div>
              <div style={{ fontSize: '10px', color: T.muted, lineHeight: 1.3, margin: '2px 0 4px' }}>
                {c.role}
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <Chip color={T.clay} bg={T.warnBg} size="xs" style={{ cursor: 'pointer' }}>ML</Chip>
                <Chip color={T.olive} bg={T.oliveBg} size="xs" style={{ cursor: 'pointer' }}>GH</Chip>
                <Chip color={T.muted} bg={T.surfaceAlt} size="xs" style={{ cursor: 'pointer' }}>IG</Chip>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TeamCandidates() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: T.slate, letterSpacing: '-0.02em' }}>
          Team · open candidates
        </h2>
        <span style={{ fontSize: '11px', color: T.mutedLight }}>
          per candidate: ML profile · GH link · IG = interview guide for the role
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
        {TEAM_CANDIDATES.map(p => <PersonCard key={p.name} person={p}/>)}
      </div>
    </div>
  );
}
