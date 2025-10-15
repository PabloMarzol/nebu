import videoBackground from "@assets/stock-footage--k-video-animation-colorful-smooth-stripes-motion-animated-background-abstract-fluid-infinite_1754997326384.webm";

interface AnimatedVideoBackgroundProps {
  className?: string;
  opacity?: number;
}

export function AnimatedVideoBackground({ 
  className = "", 
  opacity = 0.3 
}: AnimatedVideoBackgroundProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ 
          opacity: opacity,
          filter: 'blur(0.5px)',
          zIndex: -1
        }}
        onError={(e) => {
          console.warn("Video background failed to load:", e);
          // Hide video element if it fails to load
          e.currentTarget.style.display = 'none';
        }}
      >
        <source src={videoBackground} type="video/webm" />
        {/* Fallback for browsers that don't support webm */}
        <div className="w-full h-full bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20" />
      </video>
      
      {/* Optional overlay for better text readability */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/20" 
        style={{ zIndex: 0 }}
      />
    </div>
  );
}

export default AnimatedVideoBackground;