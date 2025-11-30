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
        <div className="welcome-bg" />

        <div className="welcome-container">
          <div className="welcome-card">
            <header className="welcome-header">
              <div className="header-left">
                <span className="header-tag">Day 9 · Voice Commerce</span>
                <span className="header-subtitle">Jarvis · Shopping Agent</span>
              </div>
              <div className="header-chip">#MurfAIVoiceAgentsChallenge</div>
            </header>

            <div className="welcome-grid">
              <div className="welcome-main">
                <h1 className="welcome-title">
                  Talk to{" "}
                  <span className="welcome-title-highlight">Jarvis</span>
                </h1>
                <p className="welcome-desc">
                  Jarvis is your AI shopping assistant. Describe what you want
                  to buy, and it will browse the catalog, build a cart, and
                  place simulated orders for you — all through voice.
                </p>

                <div className="command-box">
                  <div className="command-label">Try saying:</div>
                  <div className="command-pills">
                    <span className="pill">show me MacBook options</span>
                    <span className="pill">
                      find a Samsung phone under 30k
                    </span>
                    <span className="pill">
                      add the MacBook Air to my cart
                    </span>
                    <span className="pill">what did I just buy?</span>
                  </div>
                  <p className="command-note">
                    Jarvis uses tools behind the scenes to list products,
                    manage your cart, and read back your last purchase.
                  </p>
                </div>

                <Button onClick={onStartCall} className="start-button">
                  {startButtonText || "Start Voice Shopping"}
                </Button>

                <p className="welcome-footer">
                  Voice-driven e-commerce · Powered by Murf Falcon &amp; LiveKit
                </p>
              </div>

              <aside className="welcome-side">
                <div className="side-panel">
                  <div className="side-header">
                    <span className="side-title">Catalog preview</span>
                    <span className="side-pill">Developer JSON</span>
                  </div>

                  <ul className="product-list">
                    <li className="product-item">
                      <div>
                        <div className="product-name">Apple MacBook Air</div>
                        <div className="product-meta">
                          Laptop · macOS · 13-inch
                        </div>
                      </div>
                      <span className="product-price">₹1,20,000</span>
                    </li>
                    <li className="product-item">
                      <div>
                        <div className="product-name">
                          Samsung M-Series Phone
                        </div>
                        <div className="product-meta">
                          Phone · Android · mid-range
                        </div>
                      </div>
                      <span className="product-price">₹25,000</span>
                    </li>
                    <li className="product-item">
                      <div>
                        <div className="product-name">Stoneware Chai Mug</div>
                        <div className="product-meta">Mug · ceramic</div>
                      </div>
                      <span className="product-price">₹299</span>
                    </li>
                  </ul>

                  <div className="order-preview">
                    <div className="order-label">Sample order (JSON)</div>
                    <pre className="order-json">
{`{
  "id": "order-xxxxxx",
  "items": [
    { "product_id": "laptop-005", "quantity": 1 }
  ],
  "total": 120000,
  "currency": "INR"
}`}
                    </pre>
                  </div>
                </div>
              </aside>
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
            color: #e5e7eb;
            overflow: hidden;
          }

          .welcome-bg {
            position: fixed;
            inset: 0;
            background:
              radial-gradient(circle at top left, rgba(56, 189, 248, 0.15), transparent 55%),
              radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.18), transparent 60%),
              #020617;
          }

          .welcome-container {
            position: relative;
            z-index: 1;
            width: 100%;
            max-width: 980px;
          }

          .welcome-card {
            background: rgba(15, 23, 42, 0.92);
            border: 1px solid rgba(148, 163, 184, 0.4);
            border-radius: 20px;
            padding: 24px 24px 20px;
            backdrop-filter: blur(16px);
            box-shadow:
              0 32px 80px rgba(15, 23, 42, 0.9),
              0 0 0 1px rgba(15, 23, 42, 0.8);
          }

          .welcome-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
            padding-bottom: 14px;
            border-bottom: 1px solid rgba(51, 65, 85, 0.9);
          }

          .header-left {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .header-tag {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.16em;
            color: #9ca3af;
          }

          .header-subtitle {
            font-size: 14px;
            font-weight: 600;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #e5e7eb;
          }

          .header-chip {
            font-size: 11px;
            padding: 6px 12px;
            border-radius: 999px;
            border: 1px solid rgba(56, 189, 248, 0.6);
            background: rgba(15, 23, 42, 0.9);
            color: #bae6fd;
            white-space: nowrap;
          }

          .welcome-grid {
            display: grid;
            grid-template-columns: minmax(0, 1.5fr) minmax(0, 1.1fr);
            gap: 24px;
          }

          .welcome-main {
            display: flex;
            flex-direction: column;
            gap: 18px;
          }

          .welcome-title {
            margin: 0;
            font-size: 2.6rem;
            font-weight: 800;
            letter-spacing: -0.03em;
            line-height: 1.1;
          }

          .welcome-title-highlight {
            display: inline-block;
            margin-left: 6px;
            background: linear-gradient(135deg, #38bdf8, #a855f7, #fb923c);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .welcome-desc {
            font-size: 0.98rem;
            line-height: 1.7;
            color: #cbd5f5;
            margin: 0;
            max-width: 34rem;
          }

          .command-box {
            margin-top: 4px;
            padding: 14px 14px 12px;
            border-radius: 14px;
            background: rgba(15, 23, 42, 0.9);
            border: 1px dashed rgba(148, 163, 184, 0.7);
          }

          .command-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #9ca3af;
            margin-bottom: 8px;
          }

          .command-pills {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 6px;
          }

          .pill {
            font-size: 11px;
            padding: 6px 10px;
            border-radius: 999px;
            background: rgba(15, 23, 42, 0.95);
            border: 1px solid rgba(148, 163, 184, 0.7);
            color: #e5e7eb;
            white-space: nowrap;
          }

          .command-note {
            font-size: 11px;
            color: #9ca3af;
            margin: 0;
          }

          .start-button {
            width: 100%;
            margin-top: 8px;
            padding: 14px 24px;
            border-radius: 999px;
            font-size: 0.98rem;
            font-weight: 600;
            justify-content: center;
            background: linear-gradient(135deg, #22c55e, #16a34a);
            border: none;
            box-shadow:
              0 16px 40px rgba(22, 163, 74, 0.7),
              0 0 0 1px rgba(22, 163, 74, 0.35);
            transition: transform 0.15s ease, box-shadow 0.15s ease,
              filter 0.15s ease;
          }

          .start-button:hover {
            transform: translateY(-1px);
            box-shadow:
              0 20px 48px rgba(22, 163, 74, 0.8),
              0 0 0 1px rgba(22, 163, 74, 0.4);
            filter: brightness(1.02);
          }

          .start-button:active {
            transform: translateY(1px);
            box-shadow:
              0 10px 26px rgba(22, 163, 74, 0.7),
              0 0 0 1px rgba(22, 163, 74, 0.4);
          }

          .welcome-footer {
            margin: 6px 0 0;
            font-size: 11px;
            color: #6b7280;
            text-align: left;
          }

          .welcome-side {
            display: flex;
            align-items: stretch;
          }

          .side-panel {
            width: 100%;
            border-radius: 18px;
            padding: 14px 14px 10px;
            background: radial-gradient(
                circle at top,
                rgba(15, 23, 42, 0.98),
                rgba(15, 23, 42, 0.94)
              );
            border: 1px solid rgba(148, 163, 184, 0.6);
            box-shadow: 0 22px 40px rgba(15, 23, 42, 0.9);
            backdrop-filter: blur(18px);
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .side-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
          }

          .side-title {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.14em;
            color: #9ca3af;
          }

          .side-pill {
            font-size: 10px;
            padding: 4px 10px;
            border-radius: 999px;
            background: rgba(15, 23, 42, 0.9);
            border: 1px solid rgba(148, 163, 184, 0.7);
            color: #e5e7eb;
            white-space: nowrap;
          }

          .product-list {
            list-style: none;
            margin: 6px 0 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .product-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 8px;
            padding: 8px 8px;
            border-radius: 12px;
            background: rgba(15, 23, 42, 0.96);
            border: 1px solid rgba(51, 65, 85, 0.9);
          }

          .product-name {
            font-size: 0.86rem;
            font-weight: 500;
          }

          .product-meta {
            font-size: 11px;
            color: #9ca3af;
          }

          .product-price {
            font-size: 0.9rem;
            font-weight: 600;
            color: #facc15;
            white-space: nowrap;
          }

          .order-preview {
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px dashed rgba(75, 85, 99, 0.85);
          }

          .order-label {
            font-size: 11px;
            color: #9ca3af;
            margin-bottom: 4px;
          }

          .order-json {
            margin: 0;
            padding: 8px;
            border-radius: 12px;
            background: rgba(15, 23, 42, 0.98);
            border: 1px solid rgba(51, 65, 85, 0.9);
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
              "Liberation Mono", "Courier New", monospace;
            font-size: 11px;
            color: #e5e7eb;
            max-height: 130px;
            overflow: hidden;
          }

          @media (max-width: 900px) {
            .welcome-card {
              padding: 20px 18px 18px;
            }

            .welcome-grid {
              grid-template-columns: minmax(0, 1fr);
            }

            .welcome-side {
              order: -1;
            }

            .welcome-title {
              font-size: 2.2rem;
            }
          }

          @media (max-width: 640px) {
            .welcome-root {
              padding: 16px;
            }

            .welcome-card {
              border-radius: 16px;
            }

            .welcome-title {
              font-size: 2rem;
            }

            .welcome-desc {
              font-size: 0.92rem;
            }

            .pill {
              font-size: 10px;
            }

            .product-item {
              padding: 7px;
            }
          }
        `}</style>
      </div>
    );
  }
);

WelcomeView.displayName = "WelcomeView";
