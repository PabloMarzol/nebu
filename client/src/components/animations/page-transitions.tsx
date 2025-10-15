import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const [location] = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);

  useEffect(() => {
    if (location !== displayLocation) {
      setIsTransitioning(true);
      
      // Start exit animation
      setTimeout(() => {
        setDisplayLocation(location);
        
        // Complete enter animation
        setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      }, 300);
    }
  }, [location, displayLocation]);

  return (
    <div className="relative overflow-hidden">
      {/* Page Content */}
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isTransitioning 
            ? 'opacity-0 transform translate-y-8 scale-95' 
            : 'opacity-100 transform translate-y-0 scale-100'
        }`}
      >
        {children}
      </div>
      
      {/* Transition Overlay Effects */}
      {isTransitioning && (
        <>
          {/* Particle Burst Effect */}
          <div className="fixed inset-0 pointer-events-none z-50">
            <div className="particle-burst-container">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="particle-burst"
                  style={{
                    left: `${20 + (i * 60) % 80}%`,
                    top: `${30 + (i * 40) % 60}%`,
                    animationDelay: `${i * 50}ms`,
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Gradient Wave Transition */}
          <div className="fixed inset-0 pointer-events-none z-40">
            <div className="gradient-wave-transition" />
          </div>
        </>
      )}
      
      <style jsx>{`
        .particle-burst {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.9) 0%, transparent 70%);
          border-radius: 50%;
          animation: burstOut 0.6s ease-out forwards;
        }
        
        .gradient-wave-transition {
          width: 100%;
          height: 100%;
          background: linear-gradient(
            45deg,
            transparent 0%,
            rgba(59, 130, 246, 0.1) 25%,
            rgba(99, 102, 241, 0.15) 50%,
            rgba(59, 130, 246, 0.1) 75%,
            transparent 100%
          );
          background-size: 400% 400%;
          animation: waveTransition 0.6s ease-in-out;
        }
        
        @keyframes burstOut {
          0% {
            transform: scale(0) translate(0, 0);
            opacity: 1;
          }
          50% {
            transform: scale(1.5) translate(20px, -20px);
            opacity: 0.8;
          }
          100% {
            transform: scale(0.5) translate(40px, -40px);
            opacity: 0;
          }
        }
        
        @keyframes waveTransition {
          0% {
            background-position: 0% 50%;
            opacity: 0;
          }
          50% {
            background-position: 100% 50%;
            opacity: 1;
          }
          100% {
            background-position: 200% 50%;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default PageTransition;