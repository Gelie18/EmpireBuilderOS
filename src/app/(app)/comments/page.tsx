'use client';

import { useState } from 'react';
import { getDemoComments } from '@/lib/data/demo-data';
import type { Comment } from '@/lib/data/types';

const initialComments = getDemoComments();

const STATUS_CONFIG = {
  open:     { label: 'Open',     bg: 'var(--color-orange-d)', color: 'var(--color-orange)', dot: '●' },
  resolved: { label: 'Resolved', bg: 'var(--color-green-d)',  color: 'var(--color-green)',  dot: '●' },
  flagged:  { label: 'Flagged',  bg: 'var(--color-red-d)',    color: 'var(--color-red)',    dot: '△' },
};

const TAG_COLORS: Record<string, string> = {
  'requires-action': 'var(--color-red)',
  'vendor':          'var(--color-blue)',
  'forecast-risk':   'var(--color-orange)',
  'wholesale':       'var(--color-blue)',
  'savings':         'var(--color-green)',
  'renewal':         'var(--color-orange)',
  'forecast':        'var(--color-blue)',
  'operations':      'var(--color-muted)',
};

function Avatar({ initials, size = 28 }: { initials: string; size?: number }) {
  return (
    <div
      className="flex items-center justify-center flex-shrink-0 font-bold"
      style={{
        width: size,
        height: size,
        background: 'var(--color-blue-d)',
        border: '1px solid var(--color-blue)',
        color: 'var(--color-blue)',
        fontFamily: 'var(--font-condensed)',
        fontSize: size * 0.38,
        borderRadius: '50%',
      }}
    >
      {initials}
    </div>
  );
}

function Tag({ tag }: { tag: string }) {
  const color = TAG_COLORS[tag] ?? 'var(--color-muted)';
  return (
    <span
      className="text-[9px] px-1.5 py-0.5 font-bold uppercase tracking-[0.06em]"
      style={{ background: 'var(--color-surf2)', color, fontFamily: 'var(--font-condensed)' }}
    >
      {tag}
    </span>
  );
}

function CommentCard({ comment, onStatusChange }: { comment: Comment; onStatusChange: (id: string, status: Comment['status']) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [replyText, setReplyText] = useState('');
  const sc = STATUS_CONFIG[comment.status];
  const date = new Date(comment.timestamp);
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ' · ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="border" style={{ background: 'var(--color-surf)', borderColor: 'var(--color-border)' }}>
      {/* Comment header */}
      <div className="px-4 py-3 flex items-start gap-3">
        <Avatar initials={comment.authorInitials} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[13px] font-bold" style={{ fontFamily: 'var(--font-condensed)' }}>
              {comment.author}
            </span>
            <span className="text-[11px]" style={{ color: 'var(--color-muted)' }}>
              on <strong style={{ color: 'var(--color-text)' }}>{comment.targetLabel}</strong>
            </span>
            <span className="text-[10px]" style={{ color: 'var(--color-muted)' }}>{dateStr}</span>
          </div>
          <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(240,238,232,0.8)' }}>
            {comment.content}
          </p>
          {/* Tags */}
          {comment.tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mt-2">
              {comment.tags.map((t) => <Tag key={t} tag={t} />)}
            </div>
          )}
        </div>
        {/* Status pill */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-[0.06em]"
            style={{ background: sc.bg, color: sc.color, fontFamily: 'var(--font-condensed)' }}>
            {sc.dot} {sc.label}
          </span>
        </div>
      </div>

      {/* Replies */}
      {comment.replies.length > 0 && (
        <div className="border-t mx-4" style={{ borderColor: 'var(--color-border)' }}>
          {comment.replies.map((r) => {
            const rd = new Date(r.timestamp);
            return (
              <div key={r.id} className="flex gap-3 py-2.5 items-start border-b last:border-0"
                style={{ borderColor: 'var(--color-border)' }}>
                <div className="w-[28px] flex-shrink-0" /> {/* indent */}
                <Avatar initials={r.authorInitials} size={22} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[12px] font-bold" style={{ fontFamily: 'var(--font-condensed)' }}>{r.author}</span>
                    <span className="text-[10px]" style={{ color: 'var(--color-muted)' }}>
                      {rd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {rd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(240,238,232,0.75)' }}>{r.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Actions bar */}
      <div className="px-4 py-2 border-t flex items-center gap-3 flex-wrap"
        style={{ borderColor: 'var(--color-border)', background: 'var(--color-surf2)' }}>
        <button
          className="text-[11px] cursor-pointer"
          style={{ color: 'var(--color-muted)', background: 'none', border: 'none', fontFamily: 'inherit' }}
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? '↑ Hide reply' : `↩ Reply${comment.replies.length ? ` (${comment.replies.length})` : ''}`}
        </button>
        {comment.status !== 'resolved' && (
          <button
            className="text-[11px] cursor-pointer px-2 py-0.5"
            style={{
              color: 'var(--color-green)',
              background: 'var(--color-green-d)',
              border: 'none',
              fontFamily: 'var(--font-condensed)',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
            onClick={() => onStatusChange(comment.id, 'resolved')}
          >
            ✓ Resolve
          </button>
        )}
        {comment.status !== 'flagged' && comment.status !== 'resolved' && (
          <button
            className="text-[11px] cursor-pointer px-2 py-0.5"
            style={{
              color: 'var(--color-red)',
              background: 'var(--color-red-d)',
              border: 'none',
              fontFamily: 'var(--font-condensed)',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
            onClick={() => onStatusChange(comment.id, 'flagged')}
          >
            △ Flag
          </button>
        )}
      </div>

      {/* Reply input */}
      {expanded && (
        <div className="px-4 pb-3 pt-1 flex gap-2 items-start">
          <Avatar initials="ME" size={22} />
          <div className="flex-1 flex gap-2">
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Add a reply..."
              className="flex-1 px-3 py-2 text-[12px] border outline-none"
              style={{
                background: 'var(--color-surf2)',
                borderColor: 'var(--color-border2)',
                color: 'var(--color-text)',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-blue)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border2)')}
            />
            <button
              className="px-3 py-2 text-[11px] font-bold uppercase cursor-pointer"
              style={{
                background: 'var(--color-blue)',
                color: '#0B1B26',
                border: 'none',
                fontFamily: 'var(--font-condensed)',
                letterSpacing: '0.06em',
              }}
              onClick={() => setReplyText('')}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [filter, setFilter] = useState<'all' | 'open' | 'flagged' | 'resolved'>('all');
  const [newText, setNewText] = useState('');

  const filtered = filter === 'all' ? comments : comments.filter((c) => c.status === filter);

  const handleStatusChange = (id: string, status: Comment['status']) => {
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const counts = {
    all:      comments.length,
    open:     comments.filter((c) => c.status === 'open').length,
    flagged:  comments.filter((c) => c.status === 'flagged').length,
    resolved: comments.filter((c) => c.status === 'resolved').length,
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <div className="text-[22px] font-black uppercase tracking-[0.04em]"
          style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-text)' }}>
          Comments & Annotations
        </div>
        <div className="text-[12px] mt-0.5" style={{ color: 'var(--color-muted)' }}>
          Threaded notes across all financial line items — April 2026
        </div>
      </div>

      {/* Filter tabs + new comment */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1">
          {(['all', 'open', 'flagged', 'resolved'] as const).map((f) => {
            const active = filter === f;
            const cfg = f !== 'all' ? STATUS_CONFIG[f] : null;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.06em] cursor-pointer transition-colors"
                style={{
                  fontFamily: 'var(--font-condensed)',
                  background: active ? (cfg ? cfg.bg : 'var(--color-blue-d)') : 'var(--color-surf)',
                  color: active ? (cfg ? cfg.color : 'var(--color-blue)') : 'var(--color-muted)',
                  border: `1px solid ${active ? (cfg ? cfg.color : 'var(--color-blue)') : 'var(--color-border)'}`,
                }}
              >
                {f} ({counts[f]})
              </button>
            );
          })}
        </div>

        {/* Quick-add comment */}
        <div className="flex gap-2 flex-1 min-w-[240px] max-w-[420px]">
          <input
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Add a note to the period..."
            className="flex-1 px-3 py-2 text-[12px] border outline-none"
            style={{
              background: 'var(--color-surf)',
              borderColor: 'var(--color-border2)',
              color: 'var(--color-text)',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-blue)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border2)')}
          />
          <button
            className="px-3 py-2 text-[11px] font-bold uppercase cursor-pointer"
            style={{
              background: 'var(--color-blue)',
              color: '#0B1B26',
              border: 'none',
              fontFamily: 'var(--font-condensed)',
              letterSpacing: '0.06em',
            }}
            onClick={() => {
              if (!newText.trim()) return;
              const newComment: Comment = {
                id: `cmt-${Date.now()}`,
                targetId: 'general',
                targetLabel: 'General — Apr 2026',
                author: 'You',
                authorInitials: 'ME',
                content: newText.trim(),
                timestamp: new Date().toISOString(),
                status: 'open',
                tags: [],
                replies: [],
              };
              setComments((prev) => [newComment, ...prev]);
              setNewText('');
            }}
          >
            + Add
          </button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Open', count: counts.open, color: 'var(--color-orange)' },
          { label: 'Flagged', count: counts.flagged, color: 'var(--color-red)' },
          { label: 'Resolved', count: counts.resolved, color: 'var(--color-green)' },
        ].map((s) => (
          <div key={s.label} className="border px-4 py-3"
            style={{ background: 'var(--color-surf)', borderColor: 'var(--color-border)' }}>
            <div className="text-[9px] font-bold uppercase tracking-[0.08em]"
              style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)' }}>{s.label}</div>
            <div className="text-[28px] font-black leading-none mt-1"
              style={{ fontFamily: 'var(--font-condensed)', color: s.color }}>{s.count}</div>
          </div>
        ))}
      </div>

      {/* Comment list */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="text-center py-10" style={{ color: 'var(--color-muted)' }}>
            No comments with status &quot;{filter}&quot;
          </div>
        )}
        {filtered.map((c) => (
          <CommentCard key={c.id} comment={c} onStatusChange={handleStatusChange} />
        ))}
      </div>
    </div>
  );
}
