"use client";

import React from "react";
import { Button } from "@/components/livekit/button";

interface WelcomeViewProps {
  startButtonText?: string;
  onStartCall: () => void;
}

type DivProps = React.ComponentProps<"div">;
type Props = WelcomeViewProps & Omit<DivProps, "ref" | "onStartCall">;

export const WelcomeView = React.forwardRef<HTMLDivElement, Props>(
  ({ startButtonText, onStartCall, ...rest }, ref) => {
    const [cursorPos, setCursorPos] = React.useState({ x: 0, y: 0 });

    return (
      <div
        ref={ref}
        {...rest}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setCursorPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
        }}
        className="temple-root"
      >
        {/* subtle cursor aura with softer amber glow */}
        <div
          className="temple-cursor-aura"
          style={{
            transform: `translate3d(${cursorPos.x - 140}px, ${
              cursorPos.y - 140
            }px, 0)`,
          }}
        />

        {/* faint background slabs */}
        <div className="temple-plate plate-left" />
        <div className="temple-plate plate-right" />

        <div className="temple-wrap">
          <div className="temple-card">
            {/* Top strip */}
            <header className="temple-header">
              <div className="temple-header-left">
                <span className="temple-chip">Murf AI · Day 8</span>
                <span className="temple-chip ghost">Voice Game Master</span>
              </div>
              <div className="temple-header-right">
                <span className="temple-mark">
                  Aetherwyn · Ruins of Vael&apos;Thyra
                </span>
              </div>
            </header>

            <div className="temple-body">
              {/* Left column – title + description */}
              <section className="temple-main">
                <p className="temple-kicker">Jarvis · Game Master</p>
                <h1 className="temple-title">Ancient Ruins, Living Story.</h1>
                <p className="temple-desc">
                  Speak your choices to Jarvis as you explore the Ruined Temple
                  of Vael&apos;Thyra. The agent keeps track of what you&apos;ve
                  done and always ends with the ritual prompt:
                  <span className="temple-quote">"What do you do?"</span>
                </p>

                <div className="temple-panel">
                  <div className="panel-title">
                    In this session, Jarvis will:
                  </div>
                  <ul>
                    <li>Run a short D&amp;D-style adventure in Aetherwyn.</li>
                    <li>
                      Remember your path, the Heartstone, and key decisions.
                    </li>
                    <li>
                      Describe scenes clearly with numbered options.
                    </li>
                    <li>React to natural speech like "I enter the temple".</li>
                  </ul>
                </div>

                <div className="temple-hints">
                  <div className="hints-label">First actions you can try:</div>
                  <div className="hints-row">
                    <span className="hint-pill">enter_temple</span>
                    <span className="hint-pill">inspect_pillars</span>
                    <span className="hint-pill">circle_perimeter</span>
                  </div>
                  <p className="hints-note">
                    Or just say
                    <span className="mono"> "I walk into the temple"</span> and
                    Jarvis will map it to the closest option.
                  </p>
                </div>
              </section>

              {/* Right column – preview of dialog */}
              <section className="temple-preview">
                <div className="preview-label">Preview of the Game</div>
                <div className="preview-box">
                  <div className="preview-row gm">
                    <div className="preview-side gm-side">GM</div>
                    <div className="preview-bubble gm-bubble">
                      <p>
                        You stand before the shattered Temple of Vael&apos;Thyra.
                        Marble pillars hang in the air, bound by old magic. Here
                        are your options:
                      </p>
                      <p className="preview-options">
                        1. Step inside the ruins (say:
                        <span className="mono"> enter_temple</span>)
                        <br />
                        2. Inspect the floating pillars (say:
                        <span className="mono"> inspect_pillars</span>)
                        <br />
                        3. Walk the perimeter (say:
                        <span className="mono"> circle_perimeter</span>)
                      </p>
                      <p className="preview-prompt">What do you do?</p>
                    </div>
                  </div>

                  <div className="preview-row you">
                    <div className="preview-side you-side">You</div>
                    <div className="preview-bubble you-bubble">
                      <p>Let&apos;s enter the temple.</p>
                    </div>
                  </div>

                  <div className="preview-row gm">
                    <div className="preview-side gm-side">GM</div>
                    <div className="preview-bubble gm-bubble">
                      <p>
                        Noted. The Hall of Fallen Stars opens before you, lit by
                        cracks of starlight in the ceiling…
                      </p>
                      <p className="preview-prompt">What do you do?</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer */}
            <footer className="temple-footer">
              <div className="footer-left">
                <Button
                  onClick={onStartCall}
                  style={{
                    width: "100%",
                    padding: "14px 24px",
                    borderRadius: 999,
                    border: "2px solid #92400e",
                    fontSize: 16,
                    fontWeight: 700,
                    backgroundColor: "#facc15", // more matte
                    color: "#1c0a00",
                    boxShadow:
                      "0 4px 0 #78350f, 0 10px 28px rgba(0, 0, 0, 0.7)",
                    cursor: "pointer",
                    letterSpacing: "0.03em",
                  }}
                >
                  {startButtonText || "Start the Game"}
                </Button>
                <p className="footer-note">
                  Powered by Murf Falcon TTS · LiveKit Agents · Single-universe
                  voice adventure.
                </p>
              </div>
              <div className="footer-right">
                <p className="footer-meta">
                  Day 8 · Aetherwyn · Ruined Temple of Vael&apos;Thyra · Jarvis
                  as GM
                </p>
              </div>
            </footer>
          </div>
        </div>

        <style jsx>{`
          .temple-root {
            position: relative;
            min-height: 100vh;
            overflow: hidden;
            background:
              radial-gradient(
                ellipse at top,
                rgba(217, 119, 6, 0.12) 0%,
                transparent 55%
              ),
              radial-gradient(
                ellipse at bottom,
                rgba(30, 64, 45, 0.16) 0%,
                transparent 60%
              ),
              linear-gradient(180deg, #050609 0%, #12080a 40%, #050509 100%);
            color: #e5e7eb;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Inter",
              sans-serif;
          }

          .temple-cursor-aura {
            position: fixed;
            width: 260px;
            height: 260px;
            border-radius: 999px;
            pointer-events: none;
            background: radial-gradient(
              circle,
              rgba(217, 119, 6, 0.18),
              transparent 70%
            );
            mix-blend-mode: soft-light;
            filter: blur(26px);
            transition: transform 0.18s ease-out;
            z-index: 0;
            opacity: 0.5;
          }

          .temple-plate {
            position: fixed;
            width: 320px;
            height: 320px;
            border-radius: 24px;
            background: radial-gradient(
              circle at top,
              rgba(88, 28, 15, 0.18),
              rgba(17, 24, 39, 0.7)
            );
            opacity: 0.25;
            filter: blur(6px);
            pointer-events: none;
            z-index: 0;
          }

          .plate-left {
            top: -70px;
            left: -60px;
          }

          .plate-right {
            bottom: -70px;
            right: -50px;
          }

          .temple-wrap {
            position: relative;
            z-index: 2;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
          }

          .temple-card {
            width: 100%;
            max-width: 920px;
            border-radius: 24px;
            background: radial-gradient(
              circle at top left,
              rgba(251, 191, 36, 0.06),
              transparent 55%
            ),
              linear-gradient(135deg, #0b0a0a 0%, #111827 45%, #0b0a0a 100%);
            border: 1px solid rgba(75, 85, 99, 0.7);
            box-shadow: 0 26px 70px rgba(0, 0, 0, 0.9);
            padding: 18px 20px 16px 20px;
            display: flex;
            flex-direction: column;
            gap: 18px;
          }

          .temple-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(55, 65, 81, 0.7);
          }

          .temple-header-left {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }

          .temple-header-right {
            font-size: 11px;
            color: #e5e7eb;
            text-align: right;
          }

          .temple-chip {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.16em;
            padding: 4px 10px;
            border-radius: 999px;
            border: 1px solid rgba(148, 163, 184, 0.6);
            background: rgba(15, 23, 42, 0.9);
            color: #e5e7eb;
          }

          .temple-chip.ghost {
            border-style: dashed;
            color: #e5e7eb;
            opacity: 0.8;
          }

          .temple-mark {
            font-size: 11px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #fbbf24;
            opacity: 0.85;
          }

          .temple-body {
            display: grid;
            grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
            gap: 20px;
            padding-top: 6px;
          }

          .temple-main {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .temple-kicker {
            font-size: 11px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: #9ca3af;
            margin: 0;
          }

          .temple-title {
            margin: 2px 0 0 0;
            font-size: 1.7rem;
            font-weight: 800;
            color: #f9fafb;
          }

          .temple-desc {
            margin: 8px 0 0 0;
            font-size: 13px;
            color: #e5e7eb;
            line-height: 1.7;
          }

          .temple-quote {
            display: inline-block;
            margin-left: 4px;
            padding: 1px 7px;
            border-radius: 999px;
            border: 1px solid #fbbf24;
            font-size: 12px;
            color: #fbbf24;
            font-style: italic;
            background: rgba(15, 23, 42, 0.9);
          }

          .temple-panel {
            margin-top: 6px;
            padding: 12px 12px 10px 12px;
            border-radius: 14px;
            border: 1px solid rgba(55, 65, 81, 0.9);
            background: rgba(15, 23, 42, 0.8);
          }

          .panel-title {
            font-size: 12px;
            font-weight: 600;
            color: #e5e7eb;
            margin-bottom: 4px;
          }

          .temple-panel ul {
            margin: 0;
            padding-left: 18px;
            font-size: 12px;
            color: #e5e7eb;
          }

          .temple-panel li {
            margin-bottom: 4px;
          }

          .temple-hints {
            margin-top: 8px;
            padding: 10px 11px;
            border-radius: 14px;
            border: 1px dashed rgba(55, 65, 81, 0.9);
            background: rgba(15, 23, 42, 0.8);
          }

          .hints-label {
            font-size: 11px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #9ca3af;
          }

          .hints-row {
            margin-top: 6px;
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
          }

          .hint-pill {
            font-size: 11px;
            padding: 3px 8px;
            border-radius: 999px;
            border: 1px solid rgba(75, 85, 99, 0.9);
            background: rgba(15, 23, 42, 0.9);
            color: #e5e7eb;
          }

          .hints-note {
            margin: 6px 0 0 0;
            font-size: 11px;
            color: #d1d5db;
          }

          .mono {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
              "Liberation Mono", "Courier New", monospace;
            padding: 0 4px;
            color: #fbbf24;
          }

          .temple-preview {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .preview-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.16em;
            color: #9ca3af;
          }

          .preview-box {
            border-radius: 14px;
            border: 1px solid rgba(55, 65, 81, 0.9);
            background: rgba(15, 23, 42, 0.8);
            padding: 10px;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .preview-row {
            display: flex;
            gap: 6px;
          }

          .preview-side {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.16em;
            color: #9ca3af;
            padding-top: 4px;
            width: 40px;
          }

          .gm-side {
            color: #e5e7eb;
          }

          .you-side {
            color: #a7f3d0;
          }

          .preview-bubble {
            flex: 1;
            border-radius: 10px;
            padding: 7px 9px;
            font-size: 11px;
            line-height: 1.5;
          }

          .gm-bubble {
            background: rgba(15, 23, 42, 0.95);
            border: 1px solid rgba(55, 65, 81, 0.9);
            color: #e5e7eb;
          }

          .you-bubble {
            background: rgba(6, 95, 70, 0.3);
            border: 1px solid rgba(6, 95, 70, 0.6);
            color: #d1fae5;
          }

          .preview-options {
            margin: 6px 0 0 0;
            font-size: 11px;
            color: #e5e7eb;
          }

          .preview-prompt {
            margin: 6px 0 0 0;
            font-size: 11px;
            color: #fbbf24;
            font-weight: 600;
          }

          .temple-footer {
            margin-top: 6px;
            padding-top: 10px;
            border-top: 1px solid rgba(55, 65, 81, 0.9);
            display: flex;
            gap: 14px;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: flex-end;
          }

          .footer-left {
            flex: 1;
            min-width: 220px;
          }

          .footer-note {
            margin: 6px 0 0 0;
            font-size: 11px;
            color: #9ca3af;
          }

          .footer-right {
            min-width: 220px;
            text-align: right;
          }

          .footer-meta {
            margin: 0;
            font-size: 11px;
            color: #6b7280;
          }

          @media (max-width: 880px) {
            .temple-card {
              padding: 16px 14px 14px 14px;
            }
            .temple-body {
              grid-template-columns: minmax(0, 1fr);
            }
            .temple-header {
              flex-direction: column;
              align-items: flex-start;
            }
            .temple-title {
              font-size: 1.4rem;
            }
            .footer-right {
              text-align: left;
            }
          }
        `}</style>
      </div>
    );
  }
);

WelcomeView.displayName = "WelcomeView";
