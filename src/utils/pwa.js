// PWA Service Worker Registration
export const registerSW = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, show update notification
                if (confirm('New version available! Reload to update?')) {
                  window.location.reload();
                }
              }
            });
          });
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};

// PWA Install Prompt
export const installPWA = () => {
  let deferredPrompt;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show install button or banner
    showInstallBanner();
  });
  
  const showInstallBanner = () => {
    // Create install banner
    const installBanner = document.createElement('div');
    installBanner.id = 'install-banner';
    installBanner.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        left: 20px;
        right: 20px;
        background: #3b82f6;
        color: white;
        padding: 16px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="
            width: 40px;
            height: 40px;
            background: white;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: #3b82f6;
            font-size: 18px;
          ">P</div>
          <div>
            <div style="font-weight: 600; font-size: 14px;">Install ParentLink</div>
            <div style="font-size: 12px; opacity: 0.9;">Get quick access to your child's education</div>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button id="install-btn" style="
            background: white;
            color: #3b82f6;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 12px;
            cursor: pointer;
          ">Install</button>
          <button id="dismiss-btn" style="
            background: transparent;
            color: white;
            border: 1px solid rgba(255,255,255,0.3);
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
          ">×</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(installBanner);
    
    // Install button handler
    document.getElementById('install-btn').addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        deferredPrompt = null;
        hideInstallBanner();
      }
    });
    
    // Dismiss button handler
    document.getElementById('dismiss-btn').addEventListener('click', () => {
      hideInstallBanner();
    });
  };
  
  const hideInstallBanner = () => {
    const banner = document.getElementById('install-banner');
    if (banner) {
      banner.remove();
    }
  };
  
  // Hide banner when app is installed
  window.addEventListener('appinstalled', () => {
    hideInstallBanner();
    console.log('PWA was installed');
  });
};

// Check if app is running as PWA
export const isPWA = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
};

// Get device type
export const getDeviceType = () => {
  const userAgent = navigator.userAgent;
  if (/Android/i.test(userAgent)) return 'android';
  if (/iPhone|iPad|iPod/i.test(userAgent)) return 'ios';
  if (/Windows/i.test(userAgent)) return 'windows';
  if (/Mac/i.test(userAgent)) return 'mac';
  if (/Linux/i.test(userAgent)) return 'linux';
  return 'unknown';
};

// PWA utilities
export const pwaUtils = {
  registerSW,
  installPWA,
  isPWA,
  getDeviceType
};
