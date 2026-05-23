import React, { useState } from 'react';

export default function UserTable({ users }) {
  const [sortKey, setSortKey] = useState('logins');
  const [sortDir, setSortDir] = useState('desc');

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sorted = [...users].sort((a, b) => {
    let aVal = a[sortKey];
    let bVal = b[sortKey];
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ column }) => {
    if (sortKey !== column) return <span className="sort-icon dim">⇅</span>;
    return (
      <span className="sort-icon active">
        {sortDir === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div className="table-container" id="user-breakdown-table">
      <div className="table-header">
        <h3 className="table-title">
          <span className="table-title__icon">👥</span>
          Per-User Breakdown
        </h3>
        <span className="table-badge">{users.length} users</span>
      </div>
      <div className="table-scroll">
        <table className="user-table">
          <thead>
            <tr>
              <th>#</th>
              <th onClick={() => handleSort('email')} className="sortable">
                Email <SortIcon column="email" />
              </th>
              <th onClick={() => handleSort('logins')} className="sortable">
                Logins <SortIcon column="logins" />
              </th>
              <th onClick={() => handleSort('logouts')} className="sortable">
                Logouts <SortIcon column="logouts" />
              </th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-state">
                  No user data available yet
                </td>
              </tr>
            ) : (
              sorted.map((user, i) => (
                <tr key={user.userId} style={{ animationDelay: `${i * 60}ms` }}>
                  <td className="row-num">{i + 1}</td>
                  <td>
                    <div className="user-email-cell">
                      <div className="user-avatar">
                        {user.email !== 'unknown'
                          ? user.email.charAt(0).toUpperCase()
                          : '?'}
                      </div>
                      <span className="user-email-text">{user.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className="count-badge login-count">{user.logins}</span>
                  </td>
                  <td>
                    <span className="count-badge logout-count">{user.logouts}</span>
                  </td>
                  <td>
                    <span
                      className={`status-pill ${
                        user.logins > user.logouts ? 'status-active' : 'status-inactive'
                      }`}
                    >
                      {user.logins > user.logouts ? '● Online' : '○ Offline'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
