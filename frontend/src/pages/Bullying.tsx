import React, { useState, useEffect } from 'react';
import { AlertTriangle, Wifi, WifiOff, Clock, Shield } from 'lucide-react';

const BullyingNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const ws = new WebSocket('wss://kronathens.com/ws/bullying-notifications/');
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setIsLoading(false);
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newNotification = {
        id: Date.now(),
        ...data.message
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      
      if (Notification.permission === 'granted') {
        new Notification('🚨 Report', {
          body: `Emergency report from ${data.message.device_id}`,
          icon: '🚨'
        });
      }
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      setIsLoading(false);
    };
    
    ws.onerror = () => {
      setIsLoading(false);
    };
    
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    return () => ws.close();
  }, []);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to alert system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-indigo-500">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-indigo-100 rounded-full">
                <Shield className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Safety Alert System</h1>
                <p className="text-gray-600">Real-time incident monitoring</p>
              </div>
            </div>
            
            {/* Connection Status */}
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              isConnected 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {isConnected ? (
                <>
                  <Wifi className="h-4 w-4" />
                  <span className="font-medium">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4" />
                  <span className="font-medium">Disconnected</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">{notifications.length}</div>
              <div className="text-gray-600">Total Reports</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {notifications.filter(n => 
                  new Date(n.timestamp).toDateString() === new Date().toDateString()
                ).length}
              </div>
              <div className="text-gray-600">Today</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {new Set(notifications.map(n => n.device_id)).size}
              </div>
              <div className="text-gray-600">Active Devices</div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <AlertTriangle className="h-6 w-6 mr-2" />
              Recent Incidents
            </h2>
          </div>
          
          <div className="p-6">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No incidents reported</h3>
                <p className="text-gray-600">The system is monitoring and ready to receive alerts.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification, index) => (
                  <div 
                    key={notification.id} 
                    className={`border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg transition-all duration-300 ${
                      index === 0 ? 'ring-2 ring-red-200 animate-pulse' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          <span className="font-bold text-red-800">URGENT REPORT</span>
                          {index === 0 && (
                            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">NEW</span>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-4">
                            <div className="bg-white px-3 py-1 rounded-full border">
                              <span className="text-sm font-medium text-gray-700">
                                Device: {notification.device_id}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-red-700 font-medium">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right text-sm text-gray-600 ml-4">
                        <div className="flex items-center space-x-1 mb-1">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">{formatTime(notification.timestamp)}</span>
                        </div>
                        <div className="text-xs">{formatDate(notification.timestamp)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BullyingNotifications;