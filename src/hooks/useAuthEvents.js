import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export function useAuthEvents() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState({
    totalUniqueUsers: 0,
    totalFailedAttempts: 0,
    totalLogins: 0,
    userBreakdown: [],
    recentActivity: [],
  });

  useEffect(() => {
    console.log('📡 useAuthEvents: Setting up Firestore listener on "auth_events" collection...');

    // Simple collection listener — no orderBy to avoid needing a composite index.
    // Sorting is done client-side after receiving documents.
    const unsubscribe = onSnapshot(
      collection(db, 'auth_events'),
      (snapshot) => {
        console.log('✅ Firestore snapshot received! Document count:', snapshot.size);

        const events = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          events.push({
            id: doc.id,
            ...data,
            // Convert Firestore Timestamp to JS Date
            timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : null,
          });
        });

        console.log('📊 Events parsed:', events.length, 'events');
        if (events.length > 0) {
          console.log('📋 Sample event:', JSON.stringify(events[0], null, 2));
        }

        // Sort by timestamp descending (newest first) — client-side
        events.sort((a, b) => {
          if (!a.timestamp) return 1;
          if (!b.timestamp) return -1;
          return b.timestamp - a.timestamp;
        });

        // Compute metrics
        const uniqueUsers = new Set();
        let failedAttempts = 0;
        let totalLogins = 0;
        const userMap = {};

        events.forEach((event) => {
          if (event.eventType === 'login' && event.userId !== 'unknown') {
            uniqueUsers.add(event.userId);
            totalLogins++;
          }

          if (event.eventType === 'failed_attempt') {
            failedAttempts++;
          }

          // Build per-user breakdown
          if (event.userId !== 'unknown') {
            if (!userMap[event.userId]) {
              userMap[event.userId] = {
                userId: event.userId,
                email: event.email || 'unknown',
                logins: 0,
                logouts: 0,
                lastSeen: null,
              };
            }
            // Update email if we have a better one
            if (event.email && event.email !== 'unknown') {
              userMap[event.userId].email = event.email;
            }
            if (event.eventType === 'login') {
              userMap[event.userId].logins++;
            }
            if (event.eventType === 'logout') {
              userMap[event.userId].logouts++;
            }
            // Track last seen
            if (
              event.timestamp &&
              (!userMap[event.userId].lastSeen ||
                event.timestamp > userMap[event.userId].lastSeen)
            ) {
              userMap[event.userId].lastSeen = event.timestamp;
            }
          }
        });

        // Sort user breakdown by most logins first
        const userBreakdown = Object.values(userMap).sort(
          (a, b) => b.logins - a.logins
        );

        // Recent activity — first 20 events (already sorted desc)
        const recentActivity = events.slice(0, 20);

        console.log('📈 Metrics computed:', {
          uniqueUsers: uniqueUsers.size,
          failedAttempts,
          totalLogins,
          usersInBreakdown: userBreakdown.length,
        });

        setMetrics({
          totalUniqueUsers: uniqueUsers.size,
          totalFailedAttempts: failedAttempts,
          totalLogins,
          userBreakdown,
          recentActivity,
        });
        setLoading(false);
      },
      (err) => {
        console.error('❌ Firestore subscription error!');
        console.error('   Error code:', err.code);
        console.error('   Error message:', err.message);
        console.error('   Full error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      console.log('🔌 useAuthEvents: Cleaning up Firestore listener...');
      unsubscribe();
    };
  }, []);

  return { loading, error, metrics };
}
