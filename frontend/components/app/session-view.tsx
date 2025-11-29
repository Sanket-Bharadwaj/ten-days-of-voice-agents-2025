'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import type { AppConfig } from '@/app-config';
import { ChatTranscript } from '@/components/app/chat-transcript';
import { PreConnectMessage } from '@/components/app/preconnect-message';
import { TileLayout } from '@/components/app/tile-layout';
import {
  AgentControlBar,
  type ControlBarControls,
} from '@/components/livekit/agent-control-bar/agent-control-bar';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useConnectionTimeout } from '@/hooks/useConnectionTimout';
import { useDebugMode } from '@/hooks/useDebug';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../livekit/scroll-area/scroll-area';

const MotionBottom = motion.create('div');

const IN_DEVELOPMENT = process.env.NODE_ENV !== 'production';
const BOTTOM_VIEW_MOTION_PROPS = {
  variants: {
    visible: {
      opacity: 1,
      translateY: '0%',
    },
    hidden: {
      opacity: 0,
      translateY: '100%',
    },
  },
  initial: 'hidden',
  animate: 'visible',
  exit: 'hidden',
  transition: {
    duration: 0.8,
    delay: 0.2,
  },
};

interface FadeProps {
  top?: boolean;
  bottom?: boolean;
  className?: string;
}

export function Fade({ top = false, bottom = false, className }: FadeProps) {
  return (
    <div
      className={cn(
        'pointer-events-none h-16',
        top &&
          'bg-gradient-to-b from-black/80 via-black/60 to-transparent',
        bottom &&
          'bg-gradient-to-t from-black/85 via-black/60 to-transparent',
        className
      )}
    />
  );
}

interface SessionViewProps {
  appConfig: AppConfig;
}

// Small lotus divider – same style language as welcome
const LotusDecoration = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
      <svg width="28" height="16" viewBox="0 0 28 16" className="text-amber-400">
        <path
          d="M14 14 C11 13 9 11 8 8 C9.5 8.5 10.7 9 12 10 C11.8 8.5 12 7 13 5.5 C14 7 14.2 8.5 14 10 C15.3 9 16.5 8.5 18 8 C17 11 15 13 14 14 Z"
          fill="currentColor"
          fillOpacity="0.9"
        />
      </svg>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-amber-500/60 to-transparent" />
    </div>
  );
};

// Simple corner marker, subtle, to echo the temple card framing
const CornerMark = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => {
  const map: Record<typeof position, string> = {
    tl: 'top-3 left-3',
    tr: 'top-3 right-3',
    bl: 'bottom-3 left-3',
    br: 'bottom-3 right-3',
  };
  return (
    <div
      className={cn(
        'pointer-events-none absolute h-6 w-6 opacity-60',
        map[position]
      )}
    >
      <div className="h-full w-full border border-amber-600/60 rounded-sm" />
    </div>
  );
};

export const SessionView = ({
  appConfig,
  ...props
}: React.ComponentProps<'section'> & SessionViewProps) => {
  useConnectionTimeout(200_000);
  useDebugMode({ enabled: IN_DEVELOPMENT });

  const messages = useChatMessages();
  const [chatOpen, setChatOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const controls: ControlBarControls = {
    leave: true,
    microphone: true,
    chat: appConfig.supportsChatInput,
    camera: appConfig.supportsVideoInput,
    screenShare: appConfig.supportsVideoInput,
  };

  useEffect(() => {
    const lastMessage = messages.at(-1);
    const lastMessageIsLocal = lastMessage?.from?.isLocal === true;

    if (scrollAreaRef.current && lastMessageIsLocal) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <section
      className="relative z-10 h-full w-full overflow-hidden text-amber-50"
      {...props}
      style={{
        background: `
          radial-gradient(ellipse at top, rgba(217,119,6,0.16) 0%, transparent 55%),
          radial-gradient(ellipse at bottom, rgba(30,64,45,0.14) 0%, transparent 55%),
          linear-gradient(180deg, #050609 0%, #12080a 45%, #050509 100%)
        `,
      }}
    >
      {/* subtle stone/noise texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='220' height='220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.8'/%3E%3C/svg%3E")`,
        }}
      />

      {/* tiny moss hint, very subtle */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-soft-light"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 80%, rgba(22,163,74,0.18) 0%, transparent 55%), radial-gradient(circle at 80% 20%, rgba(34,197,94,0.12) 0%, transparent 55%)',
        }}
      />

      {/* soft vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.85) 100%)',
        }}
      />

      {/* Chat Transcript overlay */}
      <div
        className={cn(
          'fixed inset-0 grid grid-cols-1 grid-rows-1 transition-opacity duration-500',
          chatOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        <Fade top className="absolute inset-x-6 top-0 h-24 md:inset-x-16" />

        <div className="relative z-10 flex items-stretch justify-center pt-20 pb-[180px] md:pb-[220px]">
          <div className="mx-6 w-full max-w-3xl md:mx-12">
            <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-black/55 backdrop-blur-md shadow-[0_22px_70px_rgba(0,0,0,0.95)]">
              {/* faint inner highlight */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top,rgba(248,250,252,0.04),transparent_55%)]" />
              {/* thin inner line */}
              <div className="pointer-events-none absolute inset-[3px] rounded-xl border border-amber-500/40" />

              {/* header + lotus */}
              <div className="relative z-10 px-4 pt-4 pb-2 md:px-6">
                <div className="flex flex-col gap-1 text-[11px] text-amber-100/85 md:flex-row md:items-center md:justify-between">
                  <span>Jarvis · Game Master</span>
                  <span className="uppercase tracking-[0.16em] text-amber-200/80">
                    Aetherwyn · Ruined Temple of Vael&apos;Thyra
                  </span>
                </div>
                <LotusDecoration className="mt-2" />
              </div>

              <ScrollArea
                ref={scrollAreaRef}
                className="temple-scroll max-h-[60vh] px-4 pb-4 pt-1 md:px-6 md:pb-5"
              >
                <ChatTranscript
                  hidden={!chatOpen}
                  messages={messages}
                  className="space-y-4 text-sm"
                />
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>

      {/* Tile Layout – main "temple console" frame */}
      <div className="absolute inset-0">
        <div className="flex h-full w-full items-center justify-center p-6 md:p-12">
          <div className="relative h-full w-full max-w-5xl">
            {/* soft ambient glow behind frame */}
            <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-[radial-gradient(circle_at_15%_80%,rgba(22,163,74,0.16),transparent_60%),radial-gradient(circle_at_80%_10%,rgba(251,191,36,0.20),transparent_60%)] blur-2xl" />

            <div className="relative h-full w-full overflow-hidden rounded-2xl border border-slate-700/80 bg-[radial-gradient(circle_at_top_left,rgba(248,250,252,0.04),transparent_55%),linear-gradient(135deg,#020617_0%,#020617_45%,#020617_100%)] shadow-[0_24px_80px_rgba(0,0,0,0.95)]">
              {/* subtle inset borders like welcome card */}
              <div className="pointer-events-none absolute inset-[3px] rounded-xl border border-slate-600/70" />
              <div className="pointer-events-none absolute inset-[7px] rounded-lg border border-amber-500/35" />

              {/* tiny corner marks to finish the frame */}
              <CornerMark position="tl" />
              <CornerMark position="tr" />
              <CornerMark position="bl" />
              <CornerMark position="br" />

              <TileLayout chatOpen={chatOpen} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Control Bar */}
      <MotionBottom
        {...BOTTOM_VIEW_MOTION_PROPS}
        className="fixed inset-x-5 bottom-0 z-50 md:inset-x-20"
      >
        {appConfig.isPreConnectBufferEnabled && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <PreConnectMessage
              messages={messages}
              className="mb-3 rounded-xl border border-slate-700/80 bg-black/70 px-4 py-3 text-xs text-amber-100 shadow-[0_14px_40px_rgba(0,0,0,0.85)] md:px-5"
            />
          </motion.div>
        )}

        <div className="relative mx-auto max-w-3xl pb-6 md:pb-16">
          <Fade bottom className="absolute inset-x-0 top-0 -translate-y-full" />

          <div className="relative rounded-2xl border border-slate-700/80 bg-[#020617]/95 px-3 py-2 shadow-[0_20px_60px_rgba(0,0,0,0.9)] md:px-5 md:py-3">
            {/* slight top highlight */}
            <div className="pointer-events-none absolute inset-x-2 top-0 h-5 rounded-t-2xl bg-gradient-to-b from-amber-400/18 to-transparent" />
            {/* label + lotus to tie to welcome */}
            <div className="mb-1 flex items-center justify-between px-1 text-[11px] text-amber-100/80">
              <span className="uppercase tracking-[0.14em]">
                Voice Ritual Console
              </span>
              <span className="text-amber-200/90">Day 8 · Jarvis</span>
            </div>
            <LotusDecoration className="mb-2" />
            <AgentControlBar controls={controls} onChatOpenChange={setChatOpen} />
          </div>
        </div>
      </MotionBottom>

      {/* Hide scrollbar but keep scroll behaviour */}
      <style jsx global>{`
        .temple-scroll {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE/Edge legacy */
        }

        .temple-scroll::-webkit-scrollbar {
          display: none; /* Chrome, Safari */
        }
      `}</style>
    </section>
  );
};
