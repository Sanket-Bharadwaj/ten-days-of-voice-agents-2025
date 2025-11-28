"use client";

import React from "react";
import { Button } from "@/components/livekit/button";

interface WelcomeViewProps {
  startButtonText: string;
  onStartCall: () => void;
}

export const WelcomeView = ({
  startButtonText,
  onStartCall,
  ref,
}: React.ComponentProps<"div"> & WelcomeViewProps) => {
  const [cursorPos, setCursorPos] = React.useState({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setCursorPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }}
      className="day7-root"
    >
      {/* subtle cursor light */}
      <div
        className="cursor-light"
        style={{
          transform: `translate3d(${cursorPos.x - 150}px, ${
            cursorPos.y - 150
          }px, 0)`,
        }}
      />

      {/* ambient background blobs */}
      <div className="blob b1" />
      <div className="blob b2" />

      <div className="wrap">
        <div className="glass-card">
          {/* Header */}
          <div className="card-header">
            <span className="badge">Grocery Voice Agent</span>
            <span className="small">Murf AI · Day 7</span>
          </div>

          <div className="card-body">
            <div>
              <div className="subtitle">Food & Grocery Ordering</div>

              <h1 className="title">
                Order Groceries & Ingredients by Voice
              </h1>

              <p className="desc">
                Add items to your cart, request ingredients for dishes,
                modify selections, and place orders stored and tracked in
                SQLite with automatic status updates.
              </p>
            </div>

            <div className="steps">
              The agent can:
              <ul>
                <li>Search and add groceries to your cart</li>
                <li>Understand “ingredients for X”</li>
                <li>Update or remove items easily</li>
                <li>Store + track orders through SQLite</li>
              </ul>
            </div>

            <div style={{ marginTop: 26 }}>
              <Button
                onClick={onStartCall}
                style={{
                  width: "100%",
                  padding: "13px 18px",
                  fontSize: 15,
                  fontWeight: 600,
                  borderRadius: 999,
                  background: "#23cf7b",
                  color: "#fff",
                  border: "none",
                  boxShadow: "0 6px 14px rgba(0,0,0,0.35)",
                }}
              >
                {startButtonText || "Start Grocery Voice Agent"}
              </Button>

              <p className="note">
                Powered by Murf Falcon TTS · SQLite-backed voice ordering
              </p>
            </div>
          </div>

          <div className="card-footer">
            Food & Grocery Ordering · SQLite Voice Agent · Day 7
          </div>
        </div>
      </div>

      <style jsx>{`
        .day7-root {
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          background: radial-gradient(circle at top, #0a0f14, #05080c 60%);
        }

        /* Cursor soft light */
        .cursor-light {
          position: fixed;
          width: 300px;
          height: 300px;
          pointer-events: none;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.12),
            transparent 70%
          );
          filter: blur(50px);
          transition: transform 0.15s ease-out;
          z-index: 0;
        }

        /* Ambient blobs */
        .blob {
          position: fixed;
          width: 480px;
          height: 480px;
          border-radius: 999px;
          filter: blur(140px);
          opacity: 0.28;
          pointer-events: none;
          z-index: 0;
        }

        .b1 {
          background: #2fdd95;
          top: -100px;
          left: -120px;
          animation: b1move 30s ease-in-out infinite alternate;
        }

        .b2 {
          background: #3288ff;
          bottom: -160px;
          right: -140px;
          animation: b2move 34s ease-in-out infinite alternate;
        }

        @keyframes b1move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 40px);
          }
        }

        @keyframes b2move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(-60px, -30px);
          }
        }

        .wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 24px;
          position: relative;
          z-index: 2;
        }

        /* TRUE glassmorphism */
        .glass-card {
          width: 100%;
          max-width: 640px;
          border-radius: 26px;

          /* 100% transparent */
          background: rgba(255, 255, 255, 0.03);

          /* Apple-style inner + outer edges */
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.18);

          /* 3D depth shadow */
          box-shadow: 
            0 18px 45px rgba(0, 0, 0, 0.55),
            0 3px 8px rgba(255, 255, 255, 0.05) inset;

          overflow: hidden;
          color: #e9fdf3;
        }

        .card-header {
          padding: 14px 22px;
          display: flex;
          justify-content: space-between;
          align-items: center;

          background: rgba(255, 255, 255, 0.04);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .badge {
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .small {
          font-size: 11px;
          opacity: 0.85;
        }

        .card-body {
          padding: 26px 28px;
        }

        .subtitle {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          opacity: 0.75;
        }

        .title {
          margin-top: 6px;
          font-size: 1.55rem;
          font-weight: 800;
        }

        .desc {
          margin-top: 10px;
          font-size: 14px;
          opacity: 0.8;
          line-height: 1.6;
        }

        .steps {
          margin-top: 20px;
          padding: 16px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 13px;
          opacity: 0.95;
        }

        .steps ul {
          margin-top: 6px;
        }

        .note {
          margin-top: 12px;
          font-size: 11px;
          text-align: center;
          opacity: 0.75;
        }

        .card-footer {
          padding: 12px;
          text-align: center;
          font-size: 11px;
          background: rgba(255, 255, 255, 0.04);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
      `}</style>
    </div>
  );
};
