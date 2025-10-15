export default function WorkingAnimations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Simple CSS Particles */}
      <div className="absolute inset-0">
        <div className="absolute top-[20%] left-[10%] w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
        <div className="absolute top-[30%] left-[80%] w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
        <div className="absolute top-[60%] left-[15%] w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse"></div>
        <div className="absolute top-[80%] left-[70%] w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-[40%] left-[50%] w-1 h-1 bg-cyan-300 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-[70%] left-[30%] w-1.5 h-1.5 bg-pink-300 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-[25%] left-[60%] w-1 h-1 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-[55%] left-[85%] w-2 h-2 bg-cyan-500 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Matrix Rain Effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute left-[5%] top-0 w-0.5 h-16 bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-bounce"></div>
        <div className="absolute left-[15%] top-0 w-0.5 h-20 bg-gradient-to-b from-transparent via-cyan-300 to-transparent animate-pulse"></div>
        <div className="absolute left-[25%] top-0 w-0.5 h-12 bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute left-[35%] top-0 w-0.5 h-24 bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute left-[45%] top-0 w-0.5 h-16 bg-gradient-to-b from-transparent via-cyan-300 to-transparent animate-bounce" style={{animationDelay: '2s'}}></div>
        <div className="absolute left-[55%] top-0 w-0.5 h-20 bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute left-[65%] top-0 w-0.5 h-14 bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-bounce" style={{animationDelay: '0.8s'}}></div>
        <div className="absolute left-[75%] top-0 w-0.5 h-18 bg-gradient-to-b from-transparent via-cyan-300 to-transparent animate-pulse" style={{animationDelay: '2.5s'}}></div>
        <div className="absolute left-[85%] top-0 w-0.5 h-16 bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-bounce" style={{animationDelay: '1.2s'}}></div>
        <div className="absolute left-[95%] top-0 w-0.5 h-22 bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Glowing Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400 to-transparent h-px top-[20%] animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-400 to-transparent h-px top-[40%] animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent h-px top-[60%] animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400 to-transparent h-px top-[80%] animate-pulse" style={{animationDelay: '1.5s'}}></div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-400 to-transparent w-px left-[20%] animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-400 to-transparent w-px left-[40%] animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400 to-transparent w-px left-[60%] animate-pulse" style={{animationDelay: '2.5s'}}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-400 to-transparent w-px left-[80%] animate-pulse" style={{animationDelay: '0.8s'}}></div>
      </div>
    </div>
  );
}