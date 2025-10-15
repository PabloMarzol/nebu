import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TradingWidgetProps {
  title: string;
  value: string;
  change?: number;
  icon?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export const TradingWidget: React.FC<TradingWidgetProps> = ({
  title,
  value,
  change,
  icon = '📊',
  onClick,
  interactive = true
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (!interactive) return;
    
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 150);
    onClick?.();
  };

  const widgetVariants = {
    initial: { scale: 1, rotateY: 0 },
    hover: { 
      scale: 1.02, 
      rotateY: 5,
      transition: { duration: 0.2 }
    },
    click: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  const iconVariants = {
    initial: { rotate: 0 },
    hover: { rotate: 10 },
    click: { rotate: -10 }
  };

  const valueVariants = {
    initial: { y: 0 },
    hover: { y: -2 },
    click: { y: 2 }
  };

  return (
    <motion.div
      className={`
        relative p-4 rounded-xl border backdrop-blur-sm
        ${interactive ? 'cursor-pointer' : ''}
        ${isHovered ? 'bg-gray-800/60 border-blue-500/50' : 'bg-gray-900/40 border-gray-600/30'}
        ${isClicked ? 'shadow-lg' : 'shadow-md'}
        transition-all duration-200
      `}
      variants={widgetVariants}
      initial="initial"
      animate={isClicked ? "click" : isHovered ? "hover" : "initial"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="text-2xl"
            variants={iconVariants}
            initial="initial"
            animate={isClicked ? "click" : isHovered ? "hover" : "initial"}
          >
            {icon}
          </motion.div>
          
          <div>
            <div className="text-sm text-gray-400 mb-1">{title}</div>
            <motion.div
              className="text-xl font-bold text-white"
              variants={valueVariants}
              initial="initial"
              animate={isClicked ? "click" : isHovered ? "hover" : "initial"}
            >
              {value}
            </motion.div>
          </div>
        </div>
        
        {change !== undefined && (
          <motion.div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              change > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}
            initial={{ scale: 1 }}
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {change > 0 ? '+' : ''}{change.toFixed(2)}%
          </motion.div>
        )}
      </div>
      
      {/* Pulse effect on click */}
      {isClicked && (
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-blue-400"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 1.1, opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      )}
    </motion.div>
  );
};

export const InteractiveButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}> = ({ children, onClick, variant = 'primary', size = 'md' }) => {
  const [isPressed, setIsPressed] = useState(false);

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const rippleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: [0, 1, 0],
      transition: { duration: 0.6 }
    }
  };

  return (
    <motion.button
      className={`
        relative overflow-hidden rounded-lg font-medium transition-colors
        ${sizeClasses[size]} ${variantClasses[variant]}
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      `}
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {children}
      
      {/* Ripple effect */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-full"
          variants={rippleVariants}
          initial="initial"
          animate="animate"
        />
      )}
    </motion.button>
  );
};

export const FloatingActionButton: React.FC<{
  icon: string;
  onClick?: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}> = ({ icon, onClick, position = 'bottom-right' }) => {
  const [isHovered, setIsHovered] = useState(false);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  const fabVariants = {
    initial: { scale: 1, y: 0 },
    hover: { scale: 1.1, y: -3 },
    tap: { scale: 0.9 }
  };

  return (
    <motion.button
      className={`
        fixed z-50 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 
        rounded-full shadow-lg flex items-center justify-center text-white text-xl
        hover:shadow-xl transition-shadow duration-300
        ${positionClasses[position]}
      `}
      variants={fabVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: isHovered ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {icon}
      </motion.div>
      
      {/* Pulse ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-blue-400"
        initial={{ scale: 1, opacity: 0 }}
        animate={{ 
          scale: isHovered ? 1.5 : 1,
          opacity: isHovered ? [0, 1, 0] : 0
        }}
        transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
      />
    </motion.button>
  );
};