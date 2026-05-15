import { T } from './tokens';
import Header from './components/Header';
import KPIStrip from './components/KPIStrip';
import DailyFeed from './components/DailyFeed';
import TeamCandidates from './components/TeamCandidates';
import InterviewerCapacity from './components/InterviewerCapacity';
import DeclineOffenders from './components/DeclineOffenders';
import SharedQueue from './components/SharedQueue';
import ModuleActivity from './components/ModuleActivity';

function Section({ children, style = {} }) {
  return (
    <section style={{ padding: '0 32px', marginBottom: '24px', ...style }}>
      {children}
    </section>
  );
}

export default function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: T.ivory,
      fontFamily: T.fontSans,
      color: T.slate,
      WebkitFontSmoothing: 'antialiased',
    }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', paddingBottom: '48px' }}>

        <Header/>

        <div style={{ paddingTop: '24px' }}>

          {/* KPI strip */}
          <Section>
            <KPIStrip/>
          </Section>

          {/* Daily feed — hero */}
          <Section>
            <DailyFeed/>
          </Section>

          {/* Team & candidates */}
          <Section>
            <TeamCandidates/>
          </Section>

          {/* Interviewer capacity */}
          <Section>
            <InterviewerCapacity/>
          </Section>

          {/* Bottom row: decline offenders + shared queue + modules */}
          <Section>
            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '16px' }}>
              <DeclineOffenders/>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <SharedQueue/>
                <ModuleActivity/>
              </div>
            </div>
          </Section>

        </div>
      </div>
    </div>
  );
}
