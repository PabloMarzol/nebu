import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';

interface BackgroundIntensity {
  opacity: number;
  animation: 'slow' | 'medium' | 'fast';
  blur: number;
}

export function DynamicBackground() {
  const [location] = useLocation();
  const [currentBackground, setCurrentBackground] = useState('');
  const [intensity, setIntensity] = useState<BackgroundIntensity>({
    opacity: 1,
    animation: 'medium',
    blur: 0
  });

  const getBackgroundForRoute = (route: string): { background: string; intensity: BackgroundIntensity } => {
    const configs = {
      '/': { background: '', intensity: { opacity: 0, animation: 'slow' as const, blur: 0 } },
      '/trading': { background: 'market-waves', intensity: { opacity: 0.8, animation: 'fast' as const, blur: 2 } },
      '/portfolio': { background: 'wealth-constellation', intensity: { opacity: 0.9, animation: 'slow' as const, blur: 1 } },
      '/markets': { background: 'data-streams', intensity: { opacity: 0.7, animation: 'fast' as const, blur: 3 } },
      '/security': { background: 'cyber-fortress', intensity: { opacity: 0.6, animation: 'medium' as const, blur: 1 } },
      '/ai': { background: 'neural-network', intensity: { opacity: 0.8, animation: 'fast' as const, blur: 2 } },
      '/institutional': { background: 'corporate-towers', intensity: { opacity: 0.5, animation: 'slow' as const, blur: 1 } },
      '/admin': { background: 'command-center', intensity: { opacity: 0.6, animation: 'medium' as const, blur: 0 } },
      '/crm': { background: 'command-center', intensity: { opacity: 0.6, animation: 'medium' as const, blur: 0 } },
      '/education': { background: 'knowledge-galaxy', intensity: { opacity: 0.9, animation: 'slow' as const, blur: 1 } },
      '/social': { background: 'community-web', intensity: { opacity: 0.8, animation: 'medium' as const, blur: 2 } },
    };

    // Find matching route
    for (const [path, config] of Object.entries(configs)) {
      if (route.includes(path)) {
        return config;
      }
    }

    return { background: 'cosmic-void', intensity: { opacity: 0.7, animation: 'slow' as const, blur: 0 } };
  };

  useEffect(() => {
    const config = getBackgroundForRoute(location);
    setCurrentBackground(config.background);
    setIntensity(config.intensity);
    
    // Update CSS custom properties for adaptive intensity
    const root = document.documentElement;
    root.style.setProperty('--bg-opacity', config.intensity.opacity.toString());
    root.style.setProperty('--bg-blur', `${config.intensity.blur}px`);
    root.style.setProperty('--animation-speed', 
      config.intensity.animation === 'fast' ? '0.5s' : 
      config.intensity.animation === 'medium' ? '1s' : '2s'
    );
    
    // Remove existing background classes
    const body = document.body;
    const existingClasses = [
      'trading-nexus', 'market-waves', 'wealth-constellation', 'data-streams',
      'cyber-fortress', 'neural-network', 'corporate-towers', 'command-center',
      'knowledge-galaxy', 'community-web', 'cosmic-void'
    ];
    
    existingClasses.forEach(cls => body.classList.remove(cls));
    
    // Add new background class
    if (config.background) {
      body.classList.add(config.background);
    }
  }, [location]);

  return (
    <div 
      className={`creative-page-background ${currentBackground}`}
      style={{
        opacity: intensity.opacity,
        filter: `blur(${intensity.blur}px)`,
        transition: 'opacity 0.5s ease-in-out, filter 0.5s ease-in-out'
      }}
    />
  );
}

export default DynamicBackground;