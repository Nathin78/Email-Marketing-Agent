import { useEffect, useState, useCallback, useRef } from 'react';

let stompClient = null;
let connectionPromise = null;

const initializeConnection = () => {
  if (connectionPromise) return connectionPromise;

  connectionPromise = new Promise((resolve, reject) => {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socketUrl = `${wsProtocol}//${window.location.host}/ws-nexora`;

    const socket = new WebSocket(socketUrl);
    const subscriptions = new Map();

    socket.onopen = () => {
      console.log('WebSocket connected');
      resolve({ socket, subscriptions });
    };

    socket.onerror = () => {
      reject(new Error('WebSocket connection failed'));
    };

    socket.onclose = () => {
      stompClient = null;
      connectionPromise = null;
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('Received message:', message);
      } catch (err) {
        console.error('Error parsing message:', err);
      }
    };
  });

  return connectionPromise;
};

export const useRealtime = (topic) => {
  const [data, setData] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    const connect = async () => {
      try {
        const connection = await initializeConnection();
        const { socket, subscriptions } = connection;

        // Subscribe to the topic
        const subscription = {
          id: `sub-${topic}`,
          destination: `/topic/${topic}`,
          callback: (message) => {
            try {
              const data = JSON.parse(message.body || '{}');
              setData(data);
            } catch (err) {
              console.error('Error parsing topic message:', err);
            }
          }
        };

        subscriptions.set(topic, subscription);
        subscriptionRef.current = subscription;

        // For demo purposes, simulate real-time updates
        setConnected(true);
        setError(null);

        // Simulate data updates
        const interval = setInterval(() => {
          // Mock data for demo
          const mockData = {
            timestamp: Date.now(),
            topic: topic,
            ...generateMockData(topic)
          };
          setData(mockData);
        }, 3000);

        return () => {
          clearInterval(interval);
          subscriptions.delete(topic);
        };
      } catch (err) {
        console.error('Connection error:', err);
        setError(err.message);
        setConnected(false);
      }
    };

    connect();
  }, [topic]);

  return { data, connected, error };
};

const generateMockData = (topic) => {
  switch (topic) {
    case 'campaign-status':
      return {
        campaignId: Math.floor(Math.random() * 5) + 1,
        status: ['pending', 'sending', 'sent'][Math.floor(Math.random() * 3)],
        progress: Math.floor(Math.random() * 101),
        sentCount: Math.floor(Math.random() * 10000)
      };
    case 'analytics-updates':
      return {
        opens: Math.floor(Math.random() * 50000),
        clicks: Math.floor(Math.random() * 20000),
        bounces: Math.floor(Math.random() * 1000),
        conversions: Math.floor(Math.random() * 500)
      };
    case 'notifications':
      return {
        type: ['success', 'info', 'warning'][Math.floor(Math.random() * 3)],
        message: 'New real-time update received',
        severity: 'info'
      };
    case 'activity-feed':
      return {
        userId: `User-${Math.floor(Math.random() * 10)}`,
        action: ['opened', 'clicked', 'replied'][Math.floor(Math.random() * 3)],
        target: `Campaign-${Math.floor(Math.random() * 5)}`,
        details: 'Activity update'
      };
    case 'deliverability-metrics':
      return {
        delivered: Math.floor(Math.random() * 100000),
        bounced: Math.floor(Math.random() * 1000),
        spam: Math.floor(Math.random() * 500),
        campaignId: Math.floor(Math.random() * 5) + 1
      };
    case 'dashboard-metrics':
      return {
        activeCampaigns: Math.floor(Math.random() * 20),
        totalRecipients: Math.floor(Math.random() * 100000),
        avgOpenRate: (Math.random() * 50).toFixed(1),
        avgClickRate: (Math.random() * 15).toFixed(1)
      };
    default:
      return {};
  }
};

export const useRealtimeCampaignStatus = () => useRealtime('campaign-status');
export const useRealtimeAnalytics = () => useRealtime('analytics-updates');
export const useRealtimeNotifications = () => useRealtime('notifications');
export const useRealtimeActivity = () => useRealtime('activity-feed');
export const useRealtimeDeliverability = () => useRealtime('deliverability-metrics');
export const useRealtimeDashboard = () => useRealtime('dashboard-metrics');
