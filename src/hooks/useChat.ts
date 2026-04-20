'use client';

import { useState, useCallback, useRef } from 'react';
import type { ChatMessage, ChatContext } from '@/lib/data/types';
import { getStaticResponse } from '@/lib/ai/static-responses';

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export function useChat(context: ChatContext) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'October closed strong on revenue (+$41K vs plan) but net income missed by $38K — entirely driven by a $47K marketing overage. Two vendor invoices are unreconciled. Cash is healthy at $873K with 8.2 months of runway.\n\nPick a question below or ask me anything about the financials.',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const historyRef = useRef<{ role: 'user' | 'assistant'; content: string }[]>([]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: text.trim(),
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg]);
      historyRef.current.push({ role: 'user', content: text.trim() });
      setIsLoading(true);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: historyRef.current, context }),
        });

        if (!res.ok) throw new Error('Chat API unavailable');

        const reader = res.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let fullText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split('\n')) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.text) fullText = data.text;
                if (data.error) fullText = data.error;
              } catch {
                // skip malformed SSE lines
              }
            }
          }
        }

        // If we got back an API key / config error, fall back to static
        if (!fullText || fullText.includes('ANTHROPIC_API_KEY') || fullText.includes('API key')) {
          fullText = getStaticResponse(text);
        }

        const assistantMsg: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: fullText || getStaticResponse(text),
          timestamp: new Date().toISOString(),
        };

        historyRef.current.push({ role: 'assistant', content: assistantMsg.content });
        setMessages((prev) => [...prev, assistantMsg]);
      } catch {
        // Network / API unavailable — serve static keyword response so demo still works
        const staticReply = getStaticResponse(text);
        const assistantMsg: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: staticReply,
          timestamp: new Date().toISOString(),
        };
        historyRef.current.push({ role: 'assistant', content: staticReply });
        setMessages((prev) => [...prev, assistantMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [context, isLoading]
  );

  return { messages, isLoading, sendMessage };
}
