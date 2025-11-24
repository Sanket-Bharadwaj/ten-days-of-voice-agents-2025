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
        background: '#171821',
        color: '#f2f4fc',
        fontFamily: "'Inter', Arial, sans-serif",
        margin: 0,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <div style={{
          background: '#23243c',
          borderRadius: 20,
          boxShadow: '0 2px 22px rgba(32,34,53,0.19)',
          width: '100%',
          maxWidth: 420,
          padding: '48px 32px 38px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 34,
          textAlign: 'center'
        }}>
          <div>
            <div style={{fontSize: '1.44rem', color: '#8fdbeb', fontWeight: 700, marginBottom: 12}}>Welcome, Your Wellness Companion</div>
            <div style={{fontSize: '1.05rem', color: '#bdc6d3', marginBottom: 12, lineHeight: 1.58}}>
              Take a moment for yourself.<br />
              Start a guided wellness check-in or voice reflection any time.
            </div>
            <button
              className="startcall-btn"
              onClick={openLocal}
              style={{
                background: 'linear-gradient(90deg, #59e5a2 0%, #67bddc 100%)',
                color: '#171821',
                fontSize: '1.08rem',
                fontWeight: 600,
                border: 'none',
                borderRadius: 22,
                padding: '14px 48px',
                cursor: 'pointer',
                marginTop: 16,
                boxShadow: '0 2px 14px rgba(83,216,227,0.22)'
              }}
            >
              Start Call
            </button>
          </div>

          <div style={{background: '#222338', borderRadius: 12, padding: '18px 16px', width: '100%', color: '#8fdbeb', fontSize: '1.01rem'}}>
            Today's Reflection Prompt:<br />
            <em>“What's one intention you have for today?”</em>
          </div>

          <div style={{marginTop: 26, color: '#697ba6', fontSize: '0.97rem'}}>
            Built for your AI Voice Agent Challenge · #MinimalWellness
          </div>
        </div>
      </div>
    </>
  )
}
