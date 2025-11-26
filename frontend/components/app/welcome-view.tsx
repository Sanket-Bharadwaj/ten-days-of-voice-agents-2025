"use client";

import type React from "react";
import { Button } from "@/components/livekit/button";

interface WelcomeViewProps {
  startButtonText: string;
  onStartCall: () => void;
}

export const WelcomeView = (
  props: React.ComponentProps<"div"> & WelcomeViewProps,
) => {
  const { startButtonText, onStartCall, ...divProps } = props;

  return (
    <div {...divProps}>
      <div
        style={{
          background: "#050b1b",
          color: "#e3f2fd",
          fontFamily:
            "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div
          style={{
            background:
              "radial-gradient(circle at top left, rgba(56,189,248,0.16), transparent 55%), #071728",
            borderRadius: 22,
            boxShadow: "0 18px 45px rgba(0,0,0,0.55)",
            width: "100%",
            maxWidth: 680,
            padding: "32px 28px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            border: "1px solid rgba(148, 163, 184, 0.25)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  background:
                    "conic-gradient(from 180deg, #22c55e, #0ea5e9, #a855f7, #22c55e)",
                  padding: 2,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "999px",
                    background: "#020617",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#a5b4fc",
                  }}
                >
                  S
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    letterSpacing: 0.02,
                  }}
                >
                  Horizon AI Academy · SDR Desk
                </div>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "#9fb3c8",
                    marginTop: 2,
                  }}
                >
                  Talk to Jarvis, our voice SDR, about courses, pricing & custom
                  AI projects.
                </div>
              </div>
            </div>

            <div
              style={{
                fontSize: "0.75rem",
                padding: "4px 10px",
                borderRadius: 999,
                background: "rgba(15,118,110,0.35)",
                border: "1px solid rgba(45,212,191,0.55)",
                color: "#ccfbf1",
                textTransform: "uppercase",
                letterSpacing: 0.12,
                fontWeight: 600,
              }}
            >
              Day 5 · SDR · Murf Falcon
            </div>
          </div>

          {/* What you can ask */}
          <div
            style={{
              background: "rgba(15,23,42,0.95)",
              borderRadius: 16,
              padding: "12px 14px",
              border: "1px solid rgba(148,163,184,0.35)",
              display: "grid",
              gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr)",
              gap: 10,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                Ask Jarvis things like:
              </div>
              <ul
                style={{
                  listStyle: "disc",
                  paddingLeft: "1.2rem",
                  fontSize: "0.83rem",
                  color: "#cbd5f5",
                  lineHeight: 1.5,
                }}
              >
                <li>“What does Horizon AI Academy offer?”</li>
                <li>“How much is the Voice AI course?”</li>
                <li>“Do you offer corporate training or consulting?”</li>
                <li>“Who is this course best suited for?”</li>
              </ul>
            </div>

            <div
              style={{
                fontSize: "0.8rem",
                color: "#9ca3af",
                borderLeft: "1px solid rgba(55,65,81,0.7)",
                paddingLeft: 12,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <div style={{ fontWeight: 600, color: "#e5e7eb" }}>
                During the call, Jarvis will:
              </div>
              <div>• Understand what you’re trying to build.</div>
              <div>• Ask a few details to help our team follow up.</div>
              <div>• Summarize your needs at the end.</div>
            </div>
          </div>

          {/* Lead fields explanation */}
          <div
            style={{
              borderRadius: 14,
              padding: "10px 12px",
              background: "rgba(15,23,42,0.9)",
              border: "1px dashed rgba(148,163,184,0.55)",
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                fontSize: "0.85rem",
                color: "#cbd5f5",
                minWidth: 180,
                flex: 1,
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 4 }}>
                Info Jarvis will ask for
              </div>
              <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                So we can treat this like a real SDR call, she’ll eventually
                ask you for:
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                fontSize: "0.8rem",
              }}
            >
              {[
                "Name",
                "Company",
                "Email",
                "Role",
                "Use case",
                "Team size",
                "Timeline",
              ].map((field) => (
                <span
                  key={field}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: "rgba(15,23,42,0.95)",
                    border: "1px solid rgba(148,163,184,0.6)",
                    color: "#e5e7eb",
                    whiteSpace: "nowrap",
                  }}
                >
                  {field}
                </span>
              ))}
            </div>
          </div>

          {/* Session starter + button */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginTop: 4,
            }}
          >
            <div
              style={{
                background: "rgba(15,23,42,0.95)",
                borderRadius: 14,
                padding: "10px 12px",
                fontSize: "0.9rem",
                color: "#cbd5f5",
                border: "1px dashed rgba(148,163,184,0.5)",
              }}
            >
              <div style={{ marginBottom: 4, fontWeight: 600 }}>
                Suggested way to start
              </div>
              <div style={{ fontSize: "0.85rem", color: "#a5b4c8" }}>
                <em>
                  “Hi Jarvis, I want to know more about your Voice AI course and
                  whether it’s right for my team.”
                </em>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "#9ca3af",
                  maxWidth: 360,
                }}
              >
                This session uses{" "}
                <strong>Murf Falcon TTS</strong> for ultra-fast voice, and your
                answers will be stored in a simple JSON lead file for the
                challenge demo.
              </div>

              <Button
                onClick={onStartCall}
                className="rounded-xl px-5 py-2.5 text-sm font-semibold shadow-md"
              >
                {startButtonText || "Talk to Jarvis"}
              </Button>
            </div>
          </div>

          <div
            style={{
              marginTop: 2,
              fontSize: "0.75rem",
              color: "#64748b",
              textAlign: "right",
            }}
          >
            Murf AI Voice Agent Challenge · Horizon AI Academy · SDR Prototype
          </div>
        </div>
      </div>
    </div>
  );
};
