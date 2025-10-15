import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

interface VideoBackgroundProps {
  intensity?: number;
  overlay?: boolean;
}

export default function UniversalVideoBackground({ 
  intensity = 0.6, 
  overlay = true 
}: VideoBackgroundProps) {
  const [location] = useLocation();
  const [currentVideo, setCurrentVideo] = useState(0);

  // High-quality graphical video sources for enhanced visual experience
  const videoSources = [
    {
      src: "https://cdn.pixabay.com/video/2024/06/15/216826_large.mp4",
      name: "Tunnel Flow",
      filter: "brightness(0.6) contrast(1.4) saturate(1.5) hue-rotate(20deg)"
    },
    {
      src: "https://cdn.pixabay.com/video/2024/02/06/199558-910609536_large.mp4", 
      name: "Glitter Particles",
      filter: "brightness(0.7) contrast(1.3) saturate(1.4) hue-rotate(10deg)"
    },
    {
      src: "https://cdn.pixabay.com/video/2019/10/09/27669-365224683_large.mp4",
      name: "Particle Network", 
      filter: "brightness(0.5) contrast(1.5) saturate(1.6) hue-rotate(30deg)"
    },
    {
      src: "https://cdn.pixabay.com/video/2021/08/04/84737-580035651_large.mp4",
      name: "Digital Wave",
      filter: "brightness(0.6) contrast(1.4) saturate(1.3) hue-rotate(15deg)"
    },
    {
      src: "https://cdn.pixabay.com/video/2023/04/17/159024-819962003_large.mp4",
      name: "Cyber Grid",
      filter: "brightness(0.5) contrast(1.6) saturate(1.5) hue-rotate(25deg)"
    },
    {
      src: "https://cdn.pixabay.com/video/2024/01/18/196637-906102244_large.mp4",
      name: "Digital Matrix",
      filter: "brightness(0.6) contrast(1.4) saturate(1.4) hue-rotate(40deg)"
    },
    {
      src: "https://cdn.pixabay.com/video/2024/03/27/205507-925913538_large.mp4",
      name: "Neon Waves",
      filter: "brightness(0.7) contrast(1.3) saturate(1.6) hue-rotate(35deg)"
    }
  ];

  // Cycle through videos every 30 seconds for variety
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo(prev => (prev + 1) % videoSources.length);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getIntensityForPage = (path: string) => {
    // Adjust intensity based on page type - increased for more prominence
    if (path === '/') return 0.8; // Home page - very prominent
    if (path.includes('/trading')) return 0.6; // Trading pages - medium prominence
    if (path.includes('/portfolio')) return 0.7; // Portfolio - high prominence
    if (path.includes('/admin')) return 0.5; // Admin - medium prominence
    return 0.7; // Default - increased for all pages
  };

  const pageIntensity = getIntensityForPage(location);
  const video = videoSources[currentVideo];

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Primary Video Background */}
      <video
        key={currentVideo}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        style={{
          filter: video.filter,
          opacity: pageIntensity * intensity,
          transform: 'scale(1.1)', // Slight zoom to prevent edge artifacts
        }}
        onError={(e) => {
          console.log('Video failed to load:', video.name);
          // Fallback to next video on error
          setCurrentVideo(prev => (prev + 1) % videoSources.length);
        }}
      >
        <source src={video.src} type="video/mp4" />
      </video>

      {/* Dynamic Overlay based on page context */}
      {overlay && (
        <div 
          className="absolute inset-0"
          style={{
            background: location === '/' 
              ? 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 50%, rgba(0, 0, 0, 0.4) 100%)'
              : location.includes('/trading')
              ? 'radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.05) 0%, rgba(239, 68, 68, 0.05) 50%, rgba(0, 0, 0, 0.6) 100%)'
              : location.includes('/portfolio')
              ? 'radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.08) 0%, rgba(139, 92, 246, 0.08) 50%, rgba(0, 0, 0, 0.5) 100%)'
              : 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.06) 0%, rgba(168, 85, 247, 0.06) 50%, rgba(0, 0, 0, 0.7) 100%)'
          }}
        />
      )}

      {/* Enhanced animated particles for extra visual interest */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/30 rounded-full animate-pulse"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Additional graphical overlay for enhanced visibility */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5"
        style={{
          mixBlendMode: 'screen'
        }}
      />
    </div>
  );
}