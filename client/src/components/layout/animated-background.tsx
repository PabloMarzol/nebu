export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg 
        className="w-full h-full" 
        viewBox="0 0 1920 1080" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="particleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8">
              <animate attributeName="stop-opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite"/>
            </stop>
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6">
              <animate attributeName="stop-opacity" values="0.6;0.3;0.6" dur="3s" repeatCount="indefinite"/>
            </stop>
          </linearGradient>
          
          <linearGradient id="matrixGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0"/>
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="1"/>
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/>
          </linearGradient>
          
          <linearGradient id="streamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0"/>
            <stop offset="50%" stopColor="#ec4899" stopOpacity="1"/>
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0"/>
          </linearGradient>
        </defs>

        {/* Floating Particles */}
        {Array.from({ length: 40 }).map((_, i) => (
          <circle
            key={`particle-${i}`}
            cx={Math.random() * 1920}
            cy={Math.random() * 1080}
            r="2"
            fill="url(#particleGrad)"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values={`0,0; ${Math.random() * 200 - 100},${Math.random() * -300}; 0,0`}
              dur={`${6 + Math.random() * 4}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur={`${4 + Math.random() * 2}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* Matrix Rain Lines */}
        {Array.from({ length: 25 }).map((_, i) => (
          <line
            key={`matrix-${i}`}
            x1={i * 77}
            y1="0"
            x2={i * 77}
            y2="120"
            stroke="url(#matrixGrad)"
            strokeWidth="1"
            opacity="0.4"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,-120; 0,1200; 0,-120"
              dur={`${3 + i * 0.1}s`}
              repeatCount="indefinite"
            />
          </line>
        ))}

        {/* Data Streams */}
        {Array.from({ length: 6 }).map((_, i) => (
          <line
            key={`stream-${i}`}
            x1="0"
            y1={200 + i * 150}
            x2="100"
            y2={200 + i * 150}
            stroke="url(#streamGrad)"
            strokeWidth="1"
            opacity="0.3"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="-100,0; 2000,0; -100,0"
              dur={`${5 + i * 0.5}s`}
              repeatCount="indefinite"
            />
          </line>
        ))}

        {/* Pulsing Grid Overlay */}
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.2">
              <animate attributeName="opacity" values="0.1;0.3;0.1" dur="4s" repeatCount="indefinite"/>
            </path>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
      </svg>
    </div>
  );
}