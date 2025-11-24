import { Button } from '@/components/livekit/button';

function WelcomeImage() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-fg0 mb-4 size-16"
    >
      <path
        d="M15 24V40C15 40.7957 14.6839 41.5587 14.1213 42.1213C13.5587 42.6839 12.7956 43 12 43C11.2044 43 10.4413 42.6839 9.87868 42.1213C9.31607 41.5587 9 40.7957 9 40V24C9 23.2044 9.31607 22.4413 9.87868 21.8787C10.4413 21.3161 11.2044 21 12 21C12.7956 21 13.5587 21.3161 14.1213 21.8787C14.6839 22.4413 15 23.2044 15 24ZM22 5C21.2044 5 20.4413 5.31607 19.8787 5.87868C19.3161 6.44129 19 7.20435 19 8V56C19 56.7957 19.3161 57.5587 19.8787 58.1213C20.4413 58.6839 21.2044 59 22 59C22.7956 59 23.5587 58.6839 24.1213 58.1213C24.6839 57.5587 25 56.7957 25 56V8C25 7.20435 24.6839 6.44129 24.1213 5.87868C23.5587 5.31607 22.7956 5 22 5ZM32 13C31.2044 13 30.4413 13.3161 29.8787 13.8787C29.3161 14.4413 29 15.2044 29 16V48C29 48.7957 29.3161 49.5587 29.8787 50.1213C30.4413 50.6839 31.2044 51 32 51C32.7956 51 33.5587 50.6839 34.1213 50.1213C34.6839 49.5587 35 48.7957 35 48V16C35 15.2044 34.6839 14.4413 34.1213 13.8787C33.5587 13.3161 32.7956 13 32 13ZM42 21C41.2043 21 40.4413 21.3161 39.8787 21.8787C39.3161 22.4413 39 23.2044 39 24V40C39 40.7957 39.3161 41.5587 39.8787 42.1213C40.4413 42.6839 41.2043 43 42 43C42.7957 43 43.5587 42.6839 44.1213 42.1213C44.6839 41.5587 45 40.7957 45 40V24C45 23.2044 44.6839 22.4413 44.1213 21.8787C43.5587 21.3161 42.7957 21 42 21ZM52 17C51.2043 17 50.4413 17.3161 49.8787 17.8787C49.3161 18.4413 49 19.2044 49 20V44C49 44.7957 49.3161 45.5587 49.8787 46.1213C50.4413 46.6839 51.2043 47 52 47C52.7957 47 53.5587 46.6839 54.1213 46.1213C54.6839 45.5587 55 44.7957 55 44V20C55 19.2044 54.6839 18.4413 54.1213 17.8787C53.5587 17.3161 52.7957 17 52 17Z"
        fill="currentColor"
      />
    </svg>
  );
}

interface WelcomeViewProps {
  startButtonText: string;
  onStartCall: () => void;
}

export const WelcomeView = ({
  startButtonText,
  onStartCall,
  ref,
}: React.ComponentProps<'div'> & WelcomeViewProps) => {
  return (
    <div ref={ref}>
      <div style={{
        background: '#171821',
        color: '#f2f4fc',
        fontFamily: "'Inter', Arial, sans-serif",
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
              onClick={onStartCall}
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
              {startButtonText}
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
    </div>
  );
};
