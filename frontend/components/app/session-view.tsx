"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import type { AppConfig } from "@/app-config";
import { ChatTranscript } from "@/components/app/chat-transcript";
import { PreConnectMessage } from "@/components/app/preconnect-message";
import { TileLayout } from "@/components/app/tile-layout";
import {
  AgentControlBar,
  type ControlBarControls,
} from "@/components/livekit/agent-control-bar/agent-control-bar";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useConnectionTimeout } from "@/hooks/useConnectionTimout";
import { useDebugMode } from "@/hooks/useDebug";
import { ScrollArea } from "../livekit/scroll-area/scroll-area";
import { cn } from "@/lib/utils";

const IN_DEVELOPMENT = process.env.NODE_ENV !== "production";

interface SessionViewProps {
  appConfig: AppConfig;
}

export const SessionView = ({
  appConfig,
  ...props
}: React.ComponentProps<"section"> & SessionViewProps) => {
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
      className={cn(
        "relative flex h-screen w-full flex-col overflow-hidden bg-slate-950"
      )}
      {...props}
    >
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at top left, rgba(56,189,248,0.14) 0%, transparent 55%), radial-gradient(circle at bottom right, rgba(168,85,247,0.18) 0%, transparent 65%), #020617",
        }}
      />

      {/* CENTERED HEADER */}
      <header className="relative z-10 flex items-center justify-center border-b border-slate-800/60 px-6 py-4">
        <div className="text-center">
          <h1 className="text-lg font-semibold tracking-[0.18em] text-slate-100 uppercase">
            Jarvis · Voice Shopping Agent
          </h1>
          <p className="mt-0.5 text-xs text-slate-400">
            Describe what you want to buy. Jarvis handles the catalog, cart, and orders for you.
          </p>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-5xl">
          <TileLayout chatOpen={chatOpen} />
        </div>
      </main>

      {/* TRANSCRIPT */}
      {chatOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="relative z-20 border-t border-slate-800/60 bg-slate-950/98 backdrop-blur-md"
        >
          <div className="mx-auto max-w-5xl px-6 py-4">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
              <span>Conversation transcript</span>
              <span className="hidden text-[11px] text-slate-500 sm:inline">
                Jarvis uses this history to resolve references like “the second laptop”,
                “the black hoodie”, or “what did I just buy?”.
              </span>
            </div>
            <ScrollArea ref={scrollAreaRef} className="max-h-[40vh]">
              <ChatTranscript
                messages={messages}
                className="chat-transcript space-y-3 text-sm"
              />
            </ScrollArea>
          </div>
        </motion.div>
      )}

      {/* CONTROL BAR */}
      <div className="relative z-30 border-t border-slate-800/70 bg-slate-950/98 px-6 py-4 backdrop-blur-md">
        {appConfig.isPreConnectBufferEnabled && (
          <PreConnectMessage
            messages={messages}
            className="mb-3 text-xs text-slate-400"
          />
        )}

        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div className="hidden flex-1 text-xs text-slate-400 md:block">
            Try:{" "}
            <span className="font-medium text-slate-200">
              “Show me MacBook options under 1.2 lakh”
            </span>{" "}
            or{" "}
            <span className="font-medium text-slate-200">
              “Add the MacBook Air to my cart”
            </span>
          </div>
          <div className="ml-auto">
            <AgentControlBar
              controls={controls}
              onChatOpenChange={setChatOpen}
            />
          </div>
        </div>
      </div>

      {/* Transcript formatting */}
      <style jsx global>{`
        .chat-transcript {
          white-space: pre-wrap;
        }
      `}</style>
    </section>
  );
};
