"use client";

import Image from "next/image";
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
  return (
    <div ref={ref}>
      <div
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top, #1b3159 0, #050816 50%, #010209 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          fontFamily:
            "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          color: "#f5f7ff",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 620,
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: "0 18px 55px rgba(0,0,0,0.65)",
            border: "1px solid rgba(90,120,190,0.35)",
            background:
              "linear-gradient(140deg, rgba(8,15,30,0.95), rgba(7,13,28,0.97))",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(100,130,190,0.35)",
              background:
                "linear-gradient(90deg, rgba(0,43,92,0.95), rgba(0,86,163,0.95))",
            }}
          >

            <span
              style={{
                fontSize: 11,
                color: "#d6e4ff",
                background: "rgba(0,0,0,0.28)",
                borderRadius: 999,
                padding: "4px 10px",
              }}
            >
              Secure Voice Demo
            </span>
          </div>

          {/* Body */}
          <div style={{ padding: "26px 28px" }}>
            <div style={{ marginBottom: 18 }}>
              <div
                style={{
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  color: "#89a1d7",
                  marginBottom: 6,
                }}
              >
                HDFC Bank · Fraud Monitoring
              </div>

              <h1
                style={{
                  fontSize: "1.55rem",
                  fontWeight: 800,
                  margin: 0,
                  color: "#f9fbff",
                  lineHeight: 1.3,
                }}
              >
                Verify Card Activity Securely
              </h1>

              <p
                style={{
                  marginTop: 10,
                  fontSize: 14,
                  color: "#b8c7e4",
                  lineHeight: 1.6,
                }}
              >
                This demo simulates an HDFC Bank fraud alert call.  
                The assistant helps you verify suspicious card transactions
                by confirming your identity and checking if the flagged
                transaction is <strong>safe</strong> or <strong>fraudulent</strong>.
              </p>
            </div>

            {/* Steps info box */}
            <div
              style={{
                padding: "14px 16px",
                borderRadius: 14,
                background:
                  "linear-gradient(160deg, rgba(15,35,70,0.85), rgba(11,22,48,0.92))",
                border: "1px solid rgba(95,130,210,0.45)",
                color: "#dce6ff",
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              During the call, the agent will:
              <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                <li>Confirm your name and security identifier</li>
                <li>Read the suspicious transaction exactly as stored</li>
                <li>Ask if you authorized the transaction</li>
                <li>Mark it as <strong>safe</strong> or <strong>fraud</strong></li>
              </ul>
            </div>

            {/* CTA */}
            <div style={{ marginTop: 26 }}>
              <Button
                onClick={onStartCall}
                style={{
                  width: "100%",
                  padding: "13px 18px",
                  fontSize: 15,
                  fontWeight: 600,
                  borderRadius: 999,
                  background:
                    "linear-gradient(90deg, #e31837 0%, #ff4b5c 40%, #ff6f78 100%)",
                  color: "#ffffff",
                  border: "none",
                  boxShadow: "0 12px 30px rgba(227,24,55,0.45)",
                }}
              >
                {startButtonText || "Start Verification Call"}
              </Button>

              <p
                style={{
                  marginTop: 12,
                  fontSize: 11,
                  color: "#8fa1c5",
                  textAlign: "center",
                }}
              >
                This is a demonstration for the Murf AI Voice Agent Challenge.
                It does not connect to actual HDFC systems.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "10px 18px",
              borderTop: "1px solid rgba(60,80,130,0.5)",
              fontSize: 11,
              color: "#7d8bb4",
              textAlign: "center",
            }}
          >
            HDFC Fraud Verification · Demo Experience · Day 6
          </div>
        </div>
      </div>
    </div>
  );
};
