"use client"

import React from "react"

export default function BuddyPage() {
  const openLocal = () => {
    window.location.href = "http://localhost:3000/"
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;700&display=swap" rel="stylesheet" />
      <div style={{
        background: '#071028',
        color: '#d8eef6',
        fontFamily: "'Inter', Arial, sans-serif",
        margin: 0,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <div style={{
          background: '#07243a',
          borderRadius: 18,
          boxShadow: '0 8px 30px rgba(11,37,69,0.18)',
          width: '100%',
          maxWidth: 480,
          padding: '44px 36px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 28,
          textAlign: 'center'
        }}>
          <div>
            <div style={{fontSize: '1.5rem', color: '#ffd166', fontWeight: 800, marginBottom: 8}}>Welcome, Your Tutor Companion</div>
            <div style={{fontSize: '1.03rem', color: '#d6f0f8', marginBottom: 12, lineHeight: 1.6}}>
              Ready to learn something new?<br />
              Start a short tutoring session or ask a question anytime.
            </div>
            <button
              className="startcall-btn"
              onClick={openLocal}
              style={{
                background: 'linear-gradient(90deg, #2ec4b6 0%, #4ea8de 100%)',
                color: '#021014',
                fontSize: '1.02rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: 14,
                padding: '12px 38px',
                cursor: 'pointer',
                marginTop: 14,
                boxShadow: '0 8px 20px rgba(46,196,182,0.18)'
              }}
            >
              Start Session
            </button>
          </div>

          <div style={{background: '#052231', borderRadius: 10, padding: '16px 14px', width: '100%', color: '#bfeaf0', fontSize: '1.02rem'}}>
            Learning Prompt:<br />
            <em>“What's one thing you'd like to learn or practice today?”</em>
          </div>

          <div style={{marginTop: 20, color: '#8fb0c6', fontSize: '0.95rem'}}>
            Built for your AI Voice Agent Challenge · #MinimalTutor
          </div>
        </div>
      </div>
    </>
  )
}
