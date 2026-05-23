import React from 'react';

export default function MetricCard({ icon, label, value, subtitle, color, delay }) {
  return (
    <div
      className="metric-card"
      style={{
        '--card-accent': color || '#6366f1',
        animationDelay: `${delay || 0}ms`,
      }}
    >
      <div className="metric-card__icon-wrap" style={{ background: `${color}18` }}>
        <span className="metric-card__icon">{icon}</span>
      </div>
      <div className="metric-card__content">
        <p className="metric-card__label">{label}</p>
        <h2 className="metric-card__value">{value}</h2>
        {subtitle && <p className="metric-card__subtitle">{subtitle}</p>}
      </div>
      <div className="metric-card__glow" style={{ background: color }} />
    </div>
  );
}
