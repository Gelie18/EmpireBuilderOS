'use client';

import { useState } from 'react';
import { useDocumentLibrary, SEED_DOCUMENTS } from '@/lib/hr/documents';
import type { DocCategory, PolicyDocument } from '@/lib/hr/documents';

const CATEGORIES: { value: DocCategory; label: string }[] = [
  { value: 'handbook', label: 'Handbook' },
  { value: 'pto', label: 'PTO / Leave' },
  { value: 'benefits', label: 'Benefits' },
  { value: 'retirement', label: '401k / Retirement' },
  { value: 'expenses', label: 'Expenses' },
  { value: 'safety', label: 'Safety / OSHA' },
  { value: 'code_of_conduct', label: 'Code of Conduct' },
  { value: 'parental_leave', label: 'Parental Leave' },
  { value: 'payroll', label: 'Payroll' },
  { value: 'training', label: 'Training / Performance' },
  { value: 'other', label: 'Other' },
];

export default function AdminDocumentsPage() {
  const { all, uploaded, add, remove } = useDocumentLibrary();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocCategory>('handbook');
  const [version, setVersion] = useState('');
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);

  function reset() {
    setTitle(''); setCategory('handbook'); setVersion(''); setSummary(''); setBody(''); setFileName(null);
  }

  async function onFile(f: File | null) {
    if (!f) return;
    setFileName(f.name);
    if (!title) setTitle(f.name.replace(/\.(md|txt|pdf|docx?)$/i, '').replace(/[-_]/g, ' '));
    const isText = /\.(md|txt)$/i.test(f.name) || f.type.startsWith('text/');
    if (isText) {
      const text = await f.text();
      setBody(text);
      if (!summary) setSummary(text.slice(0, 200).replace(/\s+/g, ' ').trim());
    } else {
      // PDF/DOCX — we don't extract in the demo. Prompt the admin to paste the text.
      setBody((b) => b || `[Uploaded ${f.name} — paste the document text below or enter section headings + bodies using \\n\\n# Heading lines.]`);
    }
  }

  function onSave() {
    if (!title.trim() || !body.trim()) return;
    const sections = parseSections(body);
    const doc: Omit<PolicyDocument, 'source'> = {
      id: slug(title),
      title: title.trim(),
      category,
      version: version.trim() || 'Uploaded · v1.0',
      updatedOn: todayISO(),
      summary: summary.trim() || body.slice(0, 200).replace(/\s+/g, ' ').trim(),
      sections: sections.length > 0 ? sections : [{ heading: 'Document', body: body.trim() }],
    };
    add(doc);
    reset();
    setShowForm(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 32 }}>
      <header style={{ background: 'linear-gradient(135deg, rgba(27,77,230,0.14), rgba(245,138,31,0.04))', border: '1px solid rgba(27,77,230,0.28)', borderRadius: 14, padding: '22px 24px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E8B84B', marginBottom: 4 }}>HR Admin</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.01em' }}>Policies & handbooks</h1>
        <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 6, maxWidth: 720 }}>
          Documents here are what the HR chat searches when employees ask policy questions. The {SEED_DOCUMENTS.length} seed documents cover the basics; add your own handbook or policy and the chat will start citing it immediately.
        </div>
      </header>

      <section style={{ background: 'var(--color-surf)', border: '1px solid var(--color-border)', borderRadius: 14, padding: '20px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 10, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E8B84B', marginBottom: 4 }}>Document library</div>
            <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>{all.length} documents · {uploaded.length} uploaded · {SEED_DOCUMENTS.length} seed</div>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            style={{
              padding: '10px 16px', background: showForm ? 'var(--color-surf2)' : '#E8B84B',
              color: showForm ? 'var(--color-text)' : '#0B0D17',
              border: showForm ? '1px solid var(--color-border)' : 'none',
              borderRadius: 8, fontWeight: 800, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase',
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            {showForm ? 'Cancel' : '＋ Add document'}
          </button>
        </div>

        {showForm && (
          <div style={{ padding: '16px 18px', background: 'rgba(27,77,230,0.06)', border: '1px solid rgba(27,77,230,0.25)', borderRadius: 10, marginBottom: 14 }}>
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              <Field label="Title">
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Remote Work Policy" style={inputStyle} />
              </Field>
              <Field label="Category">
                <select value={category} onChange={(e) => setCategory(e.target.value as DocCategory)} style={inputStyle}>
                  {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </Field>
              <Field label="Version / effective">
                <input value={version} onChange={(e) => setVersion(e.target.value)} placeholder="FY26 · v1.0" style={inputStyle} />
              </Field>
              <Field label="Upload file (.md, .txt — PDF/docx paste below)">
                <input type="file" accept=".md,.txt,.pdf,.doc,.docx,text/*" onChange={(e) => onFile(e.target.files?.[0] || null)} style={{ ...inputStyle, padding: '8px' }} />
                {fileName && <div style={{ fontSize: 11, color: '#0EA572', marginTop: 4 }}>Loaded: {fileName}</div>}
              </Field>
            </div>

            <Field label="Summary (1–2 sentences shown in search results)">
              <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
            </Field>

            <Field label="Body (use `# Heading` lines to split into sections)">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={12}
                placeholder={`# Eligibility\nAll full-time employees...\n\n# Requesting\nSubmit at least 2 weeks in advance...`}
                style={{ ...inputStyle, fontFamily: 'var(--font-mono, ui-monospace)', fontSize: 12, resize: 'vertical' }}
              />
            </Field>

            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button
                onClick={onSave}
                disabled={!title.trim() || !body.trim()}
                style={{
                  padding: '10px 18px', background: '#0EA572', color: '#0B0D17',
                  border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase',
                  cursor: title.trim() && body.trim() ? 'pointer' : 'not-allowed',
                  opacity: title.trim() && body.trim() ? 1 : 0.5,
                  fontFamily: 'inherit',
                }}
              >
                Save & train chat
              </button>
              <button
                onClick={() => { reset(); setShowForm(false); }}
                style={{ padding: '10px 18px', background: 'transparent', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: 8, fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Discard
              </button>
            </div>

            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--color-muted)' }}>
              Uploaded documents live in this browser session (localStorage). In the live system, they would persist to the document store and be re-indexed automatically.
            </div>
          </div>
        )}

        {/* Document list */}
        <div style={{ display: 'grid', gap: 10 }}>
          {all.map((d) => (
            <div key={d.id + '-' + d.source} style={{ padding: '14px 16px', background: 'var(--color-surf2)', border: '1px solid var(--color-border)', borderRadius: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>{d.title}</div>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 999, background: d.source === 'seed' ? 'var(--color-surf)' : 'rgba(14,165,114,0.14)', border: '1px solid ' + (d.source === 'seed' ? 'var(--color-border)' : 'rgba(14,165,114,0.30)'), color: d.source === 'seed' ? 'var(--color-muted)' : '#0EA572' }}>
                      {d.source === 'seed' ? 'Seed' : 'Uploaded'}
                    </span>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 999, background: 'rgba(27,77,230,0.10)', border: '1px solid rgba(27,77,230,0.28)', color: '#E8B84B' }}>
                      {CATEGORIES.find((c) => c.value === d.category)?.label || d.category}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 4 }}>{d.version} · updated {d.updatedOn} · {d.sections.length} section{d.sections.length === 1 ? '' : 's'}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text)', marginTop: 8, lineHeight: 1.5 }}>{d.summary}</div>
                </div>
                {d.source === 'uploaded' && (
                  <button
                    onClick={() => remove(d.id)}
                    style={{ padding: '6px 10px', background: 'transparent', color: '#E05454', border: '1px solid rgba(224,84,84,0.30)', borderRadius: 6, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ───────────────────────────── helpers ──────────────────────────────────── */

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

function parseSections(text: string): { heading: string; body: string }[] {
  const lines = text.split('\n');
  const sections: { heading: string; body: string }[] = [];
  let current: { heading: string; body: string } | null = null;
  for (const line of lines) {
    const m = line.match(/^#+\s+(.*)$/);
    if (m) {
      if (current) sections.push(current);
      current = { heading: m[1].trim(), body: '' };
    } else if (current) {
      current.body += (current.body ? '\n' : '') + line;
    } else {
      // leading content before first heading — stash in a default section
      current = { heading: 'Overview', body: line };
    }
  }
  if (current) sections.push(current);
  return sections
    .map((s) => ({ heading: s.heading, body: s.body.trim() }))
    .filter((s) => s.body.length > 0);
}

function slug(s: string): string {
  return 'upload-' + s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
}

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
