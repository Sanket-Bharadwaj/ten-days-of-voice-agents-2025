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
    return (
      <div ref={ref} {...rest} className="welcome-root">
        {/* Simple gradient background */}
        <div className="welcome-bg" />

        <div className="welcome-container">
          <div className="welcome-card">
            {/* Header */}
            <header className="welcome-header">
              <span className="header-tag">Day 8 · Voice Journey</span>
              <span className="header-subtitle">Kurukshetra</span>
            </header>

            {/* Main Content */}
            <div className="welcome-content">
              <h1 className="welcome-title">Gita Inner Realm</h1>
              <p className="welcome-desc">
                Stand in Arjuna's place on the chariot at Kurukshetra. 
                Speak your choices. Krishna responds, always ending with:
                <span className="highlight-text">"What do you do?"</span>
              </p>

              {/* Example commands */}
              <div className="command-box">
                <div className="command-label">Example commands:</div>
                <div className="command-pills">
                  <span className="pill">step into light</span>
                  <span className="pill">see through maya</span>
                  <span className="pill">choose duty</span>
                </div>
                <p className="command-note">
                  Or simply say: <span className="mono">"Krishna, show me my path"</span>
                </p>
              </div>

              {/* Start Button */}
              <Button
                onClick={onStartCall}
                className="start-button"
              >
                {startButtonText || "Begin Journey"}
              </Button>

              <p className="welcome-footer">
                Gita-inspired voice adventure · Powered by Murf &amp; LiveKit
              </p>
            </div>
          </div>
        </div>

        <style jsx>{`
          .welcome-root {
            position: relative;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            font-family: system-ui, -apple-system, sans-serif;
          }

          .welcome-bg {
            position: fixed;
            inset: 0;
            background: 
              radial-gradient(circle at top, rgba(250,204,21,0.1) 0%, transparent 60%),
              radial-gradient(circle at bottom, rgba(15,23,42,0.8) 0%, transparent 70%),
              #020617;
          }

          .welcome-container {
            position: relative;
            z-index: 1;
            width: 100%;
            max-width: 600px;
          }

          .welcome-card {
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid rgba(71, 85, 105, 0.3);
            border-radius: 16px;
            padding: 32px;
            backdrop-filter: blur(12px);
          }

          .welcome-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 32px;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(71, 85, 105, 0.3);
          }

          .header-tag {
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #fbbf24;
            font-weight: 600;
          }

          .header-subtitle {
            font-size: 18px;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: #fbbf24;
            font-weight: 700;
            text-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
          }

          .welcome-content {
            display: flex;
            flex-direction: column;
            gap: 24px;
          }

          .welcome-title {
            font-size: 3.5rem;
            font-weight: 800;
            background: linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin: 0;
            line-height: 1.1;
            letter-spacing: -0.02em;
          }

          .welcome-desc {
            font-size: 16px;
            line-height: 1.7;
            color: #e2e8f0;
            margin: 0;
          }

          .highlight-text {
            display: inline-block;
            margin-left: 8px;
            padding: 4px 14px;
            border-radius: 999px;
            background: rgba(251, 191, 36, 0.2);
            border: 1px solid rgba(251, 191, 36, 0.4);
            color: #fbbf24;
            font-size: 15px;
            font-style: italic;
            font-weight: 600;
          }

          .command-box {
            padding: 16px;
            border-radius: 12px;
            background: rgba(15, 23, 42, 0.5);
            border: 1px dashed rgba(71, 85, 105, 0.4);
          }

          .command-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #94a3b8;
            margin-bottom: 10px;
          }

          .command-pills {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-bottom: 10px;
          }

          .pill {
            font-size: 12px;
            padding: 4px 12px;
            border-radius: 999px;
            background: rgba(30, 41, 59, 0.8);
            border: 1px solid rgba(71, 85, 105, 0.5);
            color: #cbd5e1;
          }

          .command-note {
            font-size: 12px;
            color: #94a3b8;
            margin: 0;
          }

          .mono {
            font-family: ui-monospace, monospace;
            color: #fbbf24;
            padding: 0 4px;
          }

          .start-button {
            width: 100%;
            padding: 16px 32px;
            border-radius: 999px;
            border: 2px solid #92400e;
            font-size: 16px;
            font-weight: 700;
            background: #fbbf24;
            color: #1c0a00;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 4px 0 #78350f, 0 10px 30px rgba(0, 0, 0, 0.5);
          }

          .start-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 0 #78350f, 0 12px 35px rgba(0, 0, 0, 0.6);
          }

          .start-button:active {
            transform: translateY(1px);
            box-shadow: 0 2px 0 #78350f, 0 6px 20px rgba(0, 0, 0, 0.4);
          }

          .welcome-footer {
            font-size: 11px;
            color: #64748b;
            text-align: center;
            margin: 0;
          }

          @media (max-width: 640px) {
            .welcome-card {
              padding: 24px;
            }

            .welcome-title {
              font-size: 2.5rem;
            }

            .welcome-desc {
              font-size: 15px;
            }

            .header-tag {
              font-size: 11px;
            }

            .header-subtitle {
              font-size: 14px;
            }
          }
        `}</style>
      </div>
    );
  }
);

WelcomeView.displayName = "WelcomeView";
