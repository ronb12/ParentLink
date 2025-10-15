import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Monitor, Wifi, WifiOff } from 'lucide-react';
import { pwaUtils } from '../utils/pwa';

const PWAStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isPWA, setIsPWA] = useState(false);
  const [deviceType, setDeviceType] = useState('unknown');

  useEffect(() => {
    setIsPWA(pwaUtils.isPWA());
    setDeviceType(pwaUtils.getDeviceType());

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'android':
      case 'ios':
        return <Smartphone className="h-4 w-4" />;
      case 'windows':
      case 'mac':
      case 'linux':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getConnectionIcon = () => {
    return isOnline ? (
      <Wifi className="h-4 w-4 text-green-600" />
    ) : (
      <WifiOff className="h-4 w-4 text-red-600" />
    );
  };

  if (!isPWA) {
    return (
      <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
        {getDeviceIcon()}
        <span className="capitalize">{deviceType}</span>
        {getConnectionIcon()}
        <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center space-x-2 text-sm text-primary-600">
      <Download className="h-4 w-4" />
      <span>PWA Installed</span>
      {getConnectionIcon()}
      <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  );
};

export default PWAStatus;
