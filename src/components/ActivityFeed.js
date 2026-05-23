import React from 'react';
import { formatRelativeTime } from '../utils/timeFormat';

const EVENT_CONFIG = {
  login: {
    icon: '🔓',
    label: 'Logged in',
    color: '#22c55e',
  },
  logout: {
    icon: '🔒',
    label: 'Logged out',
    color: '#f59e0b',
  },
  failed_attempt: {
    icon: '⚠️',
    label: 'Failed attempt',
    color: '#ef4444',
  },
};

export default function ActivityFeed({ events }) {
  return (
    <div className="activity-feed" id="recent-activity-feed">
      <div className="table-header">
        <h3 className="table-title">
          <span className="table-title__icon">📋</span>
          Recent Activity
        </h3>
        <span className="table-badge live-badge">
          <span className="live-dot" />
          Live
        </span>
      </div>
      <div className="feed-list">
        {events.length === 0 ? (
          <div className="empty-state feed-empty">No events recorded yet</div>
        ) : (
          events.map((event, i) => {
            const config = EVENT_CONFIG[event.eventType] || EVENT_CONFIG.login;
            return (
              <div
                key={event.id}
                className="feed-item"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div
                  className="feed-item__icon"
                  style={{ background: `${config.color}18`, color: config.color }}
                >
                  {config.icon}
                </div>
                <div className="feed-item__body">
                  <p className="feed-item__text">
                    <strong>{event.email !== 'unknown' ? event.email : 'Unknown user'}</strong>
                    {' '}
                    <span style={{ color: config.color }}>{config.label}</span>
                  </p>
                  <p className="feed-item__time">
                    {formatRelativeTime(event.timestamp)}
                  </p>
                </div>
                <div
                  className="feed-item__dot"
                  style={{ background: config.color }}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
