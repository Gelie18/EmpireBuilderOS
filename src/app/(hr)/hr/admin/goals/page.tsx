'use client';

import { useState } from 'react';
import { usePersona } from '@/lib/hr/context';
import { PERSONAS, PERSONA_ORDER } from '@/lib/hr/personas';
import type { Goal, PersonaId } from '@/lib/hr/personas';

interface DraftGoal {
  id: string;
  title: string;
  description: string;
  assignee: PersonaId;
  period: string;
  dueDate: string;
}

export default function AdminGoalsPage() {
  const { persona } = usePersona();
  const [drafts, setDrafts] = useState<DraftGoal[]>([]);

  // Form state
  const [assignee, setAssignee] = useState<PersonaId>('field_tech');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [period, setPeriod] = useState('FY 2026');
  const [dueDate, setDueDate] = useState('2026-12-31');

  function reset() {
    setTitle(''); setDescription(''); setPeriod('FY 2026'); setDueDate('2026-12-31');
  }

  function assign() {
    if (!title.trim()) return;
    const d: DraftGoal = {
      id: 'draft-' + Math.random().toString(36).slice(2, 8),
      title: title.trim(),
      description: description.trim(),
      assignee,
      period,
      dueDate,
    };
    setDrafts((prev) => [d, ...prev]);
    reset();
  }

  function removeDraft(id: string) {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  }

  const headerName = persona.profile.directReports ? `${persona.profile.firstName}'s team` : 'Manager goal assignments';
  const reportsList = persona.profile.directReports;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 32 }}>
      <header style={{ background: 'linear-gradient(135deg, rgba(27,77,230,0.14), rgba(245,138,31,0.04))', border: '1px solid rgba(27,77,230,0.28)', borderRadius: 14, padding: '22px 24px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#F58A1F', marginBottom: 4 }}>HR Admin</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.01em' }}>Draft & assign goals — {headerName}</h1>
        <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 6, maxWidth: 760 }}>
          Managers draft 1–2 goals for each direct report each cycle; employees propose the rest. Employees see the goal on their Profile page and can update progress from the chat.
          {!reportsList && <> You are viewing as <strong>{persona.profile.firstName}</strong> — who does not have direct reports in this demo. Switch to <strong>Leah Thompson</strong> (persona switcher top-right) to try the assignment flow with a real team.</>}
        </div>
      </header>

      <section style={{ background: 'var(--color-surf)', border: '1px solid var(--color-border)', borderRadius: 14, padding: '20px 22px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#F58A1F', marginBottom: 12 }}>New goal</div>

        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          <Field label="Assign to">
            <select value={assignee} onChange={(e) => setAssignee(e.target.value as PersonaId)} style={inputStyle}>
              {PERSONA_ORDER.map((id) => (
                <option key={id} value={id}>
                  {PERSONAS[id].profile.firstName} {PERSONAS[id].profile.lastName} — {PERSONAS[id].profile.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Period">
            <select value={period} onChange={(e) => setPeriod(e.target.value)} style={inputStyle}>
              <option>FY 2026</option>
              <option>Q2 2026</option>
              <option>Q3 2026</option>
              <option>Q4 2026</option>
            </select>
          </Field>
          <Field label="Due date">
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={inputStyle} />
          </Field>
        </div>

        <Field label="Goal title">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Zero missed punches in a rolling 60-day window" style={inputStyle} />
        </Field>
        <Field label="Description / success criteria">
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="What does success look like? How will we measure it?" style={{ ...inputStyle, resize: 'vertical' }} />
        </Field>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button
            onClick={assign}
            disabled={!title.trim()}
            style={{
              padding: '10px 18px', background: '#F58A1F', color: '#0B0D17',
              border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase',
              cursor: title.trim() ? 'pointer' : 'not-allowed', opacity: title.trim() ? 1 : 0.5, fontFamily: 'inherit',
            }}
          >
            Assign goal
          </button>
          <button
            onClick={reset}
            style={{ padding: '10px 18px', background: 'transparent', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: 8, fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Clear
          </button>
        </div>
      </section>

      {/* Existing goals per report */}
      {reportsList && reportsList.length > 0 && (
        <section style={{ background: 'var(--color-surf)', border: '1px solid var(--color-border)', borderRadius: 14, padding: '20px 22px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#F58A1F', marginBottom: 12 }}>Team snapshot</div>
          <div style={{ display: 'grid', gap: 10 }}>
            {reportsList.map((name) => (
              <ReportRow key={name} name={name} />
            ))}
          </div>
        </section>
      )}

      {/* Existing persona goals (shows what's live for this persona) */}
      <section style={{ background: 'var(--color-surf)', border: '1px solid var(--color-border)', borderRadius: 14, padding: '20px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#F58A1F', marginBottom: 4 }}>Assigned goals per persona</div>
            <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>Live goals visible on each employee&apos;s Profile.</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 }}>
          {PERSONA_ORDER.map((id) => <PersonaGoalColumn key={id} id={id} />)}
        </div>
      </section>

      {/* Draft goals staged in this session */}
      {drafts.length > 0 && (
        <section style={{ background: 'rgba(14,165,114,0.06)', border: '1px solid rgba(14,165,114,0.30)', borderRadius: 14, padding: '20px 22px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#0EA572', marginBottom: 10 }}>Draft assignments · this session</div>
          <div style={{ display: 'grid', gap: 10 }}>
            {drafts.map((d) => (
              <div key={d.id} style={{ padding: '12px 14px', background: 'var(--color-surf2)', border: '1px solid var(--color-border)', borderRadius: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>{d.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 4 }}>
                      Assigned to <strong style={{ color: 'var(--color-text)' }}>{PERSONAS[d.assignee].profile.firstName} {PERSONAS[d.assignee].profile.lastName}</strong> · {d.period} · due {d.dueDate}
                    </div>
                    {d.description && <div style={{ fontSize: 13, color: 'var(--color-text)', marginTop: 8, lineHeight: 1.5 }}>{d.description}</div>}
                  </div>
                  <button onClick={() => removeDraft(d.id)} style={{ padding: '6px 10px', background: 'transparent', color: 'var(--color-muted)', border: '1px solid var(--color-border)', borderRadius: 6, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, fontSize: 11, color: 'var(--color-muted)' }}>
            In the live system, pressing &quot;Assign&quot; would notify the employee, add the goal to their review cycle, and schedule a 1:1 kickoff. For this demo, assignments stay local to your session.
          </div>
        </section>
      )}
    </div>
  );
}

function ReportRow({ name }: { name: string }) {
  // Synthesize a lightweight row per direct-report name.
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '10px 12px', background: 'var(--color-surf2)', border: '1px solid var(--color-border)', borderRadius: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(27,77,230,0.20)', border: '1px solid rgba(27,77,230,0.35)', color: 'var(--color-text)', fontWeight: 700, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {name.split(' ').map((s) => s[0]).join('')}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)' }}>{name}</div>
          <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>Direct report</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        <Metric label="Goals" value="3" />
        <Metric label="Review" value="Self-review" />
        <Metric label="Readiness" value="60%" />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>{label}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text)', marginTop: 2 }}>{value}</div>
    </div>
  );
}

function PersonaGoalColumn({ id }: { id: PersonaId }) {
  const p = PERSONAS[id];
  return (
    <div style={{ background: 'var(--color-surf2)', border: '1px solid var(--color-border)', borderRadius: 10, padding: '14px 16px' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)' }}>{p.profile.firstName} {p.profile.lastName}</div>
      <div style={{ fontSize: 11, color: 'var(--color-muted)', marginBottom: 10 }}>{p.profile.title}</div>
      {p.goals.length === 0 ? (
        <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>No goals yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {p.goals.slice(0, 3).map((g) => <MiniGoal key={g.id} g={g} />)}
          {p.goals.length > 3 && (
            <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>+{p.goals.length - 3} more</div>
          )}
        </div>
      )}
    </div>
  );
}

function MiniGoal({ g }: { g: Goal }) {
  const tone = g.status === 'on_track' ? '#0EA572' : g.status === 'at_risk' ? '#F0A030' : g.status === 'off_track' ? '#E05454' : '#F58A1F';
  return (
    <div style={{ padding: '8px 10px', background: 'var(--color-surf)', border: '1px solid var(--color-border)', borderRadius: 6 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text)' }}>{g.title}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, fontSize: 10, color: 'var(--color-muted)' }}>
        <span>{g.period} · due {g.dueDate}</span>
        <span style={{ color: tone, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{g.progress}% · {g.status.replace('_', ' ')}</span>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--color-surf2)',
  border: '1px solid var(--color-border)',
  borderRadius: 8,
  padding: '10px 12px',
  color: 'var(--color-text)',
  fontSize: 13,
  fontFamily: 'inherit',
  outline: 'none',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 10 }}>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>{label}</span>
      {children}
    </label>
  );
}
