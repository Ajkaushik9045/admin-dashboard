import React from 'react';
import { useAuthEvents } from './hooks/useAuthEvents';
import MetricCard from './components/MetricCard';
import UserTable from './components/UserTable';
import ActivityFeed from './components/ActivityFeed';
import './App.css';

function App() {
  const { loading, error, metrics } = useAuthEvents();

  if (error) {
    return (
      <div className="app">
        <div className="bg-orb bg-orb--1" />
        <div className="bg-orb bg-orb--3" />
        <div className="error-screen">
          <div className="error-icon">⚡</div>
          <h2>Unable to Connect</h2>
          <p>Something went wrong while connecting to the database. Please check your connection and try again.</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Ambient background orbs */}
      <div className="bg-orb bg-orb--1" />
      <div className="bg-orb bg-orb--2" />
      <div className="bg-orb bg-orb--3" />

      {/* Header */}
      <header className="dashboard-header" id="dashboard-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">🛡️</span>
            <div>
              <h1 className="logo-title">Auth Dashboard</h1>
              <p className="logo-subtitle">NeoShare Admin Panel</p>
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="connection-status">
            <span className="live-dot" />
            <span>Live Sync</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {loading ? (
          <div className="loading-screen">
            <div className="loader" />
            <p>Connecting to Firestore...</p>
          </div>
        ) : (
          <>
            {/* Metrics Row */}
            <section className="metrics-grid" id="metrics-section">
              <MetricCard
                icon="👤"
                label="Total Unique Users"
                value={metrics.totalUniqueUsers}
                subtitle="Authenticated via Google"
                color="#6366f1"
                delay={0}
              />
              <MetricCard
                icon="⚠️"
                label="Failed Attempts"
                value={metrics.totalFailedAttempts}
                subtitle="Cancelled or errored sign-ins"
                color="#ef4444"
                delay={100}
              />
              <MetricCard
                icon="🔑"
                label="Total Logins"
                value={metrics.totalLogins}
                subtitle="All successful sign-ins"
                color="#22c55e"
                delay={200}
              />
            </section>

            {/* Bottom Grid: Table + Activity Feed */}
            <section className="content-grid">
              <UserTable users={metrics.userBreakdown} />
              <ActivityFeed events={metrics.recentActivity} />
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>
          NeoShare Admin Dashboard &middot; Firebase Project:{' '}
          <code>neoshare-e2fa7</code>
        </p>
      </footer>
    </div>
  );
}

export default App;
