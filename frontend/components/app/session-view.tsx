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

const IN_DEVELOPMENT = process.env.NODE_ENV !== 'production';

interface SessionViewProps {
  appConfig: AppConfig;
}

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
      className="relative flex h-screen w-full flex-col overflow-hidden bg-slate-950"
      {...props}
    >
      {/* Simple gradient background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(250,204,21,0.08) 0%, transparent 70%), #020617',
        }}
      />

      {/* HEADER - Text in center of navbar */}
      <header className="relative z-10 flex items-center justify-center border-b border-slate-800/50 px-6 py-4">
        <div className="text-center">
          <h1 className="text-lg font-medium text-amber-50">
            Gita Inner Realm
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Krishna guides you through the battlefield of Kurukshetra
          </p>
        </div>
      </header>

      {/* MAIN CONTENT - Single centered tile */}
      <main className="relative z-10 flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          <TileLayout chatOpen={chatOpen} />
        </div>
      </main>

      {/* TRANSCRIPT - Only shows when chat is open, non-overlapping */}
      {chatOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="relative z-20 border-t border-slate-800/50 bg-slate-950/95"
        >
          <div className="mx-auto max-w-4xl px-6 py-4">
            <div className="mb-2 text-xs text-slate-400">Transcript</div>
            <ScrollArea
              ref={scrollAreaRef}
              className="max-h-[40vh]"
            >
              <ChatTranscript
                messages={messages}
                className="space-y-3 text-sm"
              />
            </ScrollArea>
          </div>
        </motion.div>
      )}

      {/* BOTTOM CONTROL BAR - Clean and fixed */}
      <div className="relative z-30 border-t border-slate-800/50 bg-slate-950/98 px-6 py-4">
        {appConfig.isPreConnectBufferEnabled && (
          <PreConnectMessage
            messages={messages}
            className="mb-3 text-xs text-slate-400"
          />
        )}

        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <div className="hidden text-xs text-slate-400 md:block">
            Speak naturally to continue your journey
          </div>
          <div className="ml-auto">
            <AgentControlBar controls={controls} onChatOpenChange={setChatOpen} />
          </div>
        </div>
      </div>

      {/* Preserve formatting in transcript */}
      <style jsx global>{`
        .chat-transcript {
          white-space: pre-wrap;
        }
      `}</style>
    </section>
  );
};
