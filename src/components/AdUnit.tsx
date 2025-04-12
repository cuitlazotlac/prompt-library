import { useEffect, useRef, useState } from 'react';

interface AdUnitProps {
  type: 'banner' | 'sidebar' | 'content';
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

// Ad unit configurations
const adConfigs = {
  banner: {
    'data-ad-format': 'auto',
    'data-full-width-responsive': 'true',
    'data-ad-slot': '5708878820',
    dimensions: { minHeight: '90px' },
  },
  sidebar: {
    'data-ad-format': 'auto',
    'data-full-width-responsive': 'true',
    'data-ad-slot': '5708878820',
    dimensions: { minHeight: '600px' },
  },
  content: {
    'data-ad-format': 'auto',
    'data-full-width-responsive': 'true',
    'data-ad-slot': '5708878820',
    dimensions: { minHeight: '250px' },
  },
};

const MAX_RETRIES = 5;
const RETRY_DELAY = 1000; // 1 second

export function AdUnit({ type, className = '' }: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const pushAd = () => {
      if (retryCount >= MAX_RETRIES) {
        console.error('Failed to load AdSense after maximum retries');
        return;
      }

      if (!(window as any).adsbygoogle) {
        console.log(`AdSense not loaded yet. Retry attempt ${retryCount + 1}/${MAX_RETRIES}`);
        setRetryCount(prev => prev + 1);
        timeoutId = setTimeout(pushAd, RETRY_DELAY);
        return;
      }

      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
        console.log('Ad push successful for', type);
        setIsLoaded(true);
      } catch (error) {
        console.error('Error pushing ad:', error);
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          timeoutId = setTimeout(pushAd, RETRY_DELAY);
        }
      }
    };

    pushAd();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [type, retryCount]);

  const { dimensions, ...config } = adConfigs[type];

  return (
    <div 
      className={`ad-unit ad-unit-${type} ${className}`} 
      style={{ 
        minHeight: dimensions.minHeight,
        backgroundColor: isLoaded ? 'transparent' : '#f0f0f0',
        transition: 'background-color 0.3s ease'
      }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', ...dimensions }}
        data-ad-client="ca-pub-6558224888596733"
        data-ad-test="on"
        {...config}
      />
      {!isLoaded && retryCount > 0 && retryCount < MAX_RETRIES && (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-muted-foreground">
            Loading advertisement... ({retryCount}/{MAX_RETRIES})
          </p>
        </div>
      )}
      {retryCount >= MAX_RETRIES && !isLoaded && (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-muted-foreground">
            Advertisement unavailable
          </p>
        </div>
      )}
    </div>
  );
} 