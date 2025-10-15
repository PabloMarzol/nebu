import { useState, useEffect, useCallback } from 'react';

interface UserBehavior {
  interactionCount: number;
  timeSpent: number;
  preferredSections: string[];
  deviceType: 'mobile' | 'tablet' | 'desktop';
  accessibilityNeeds: boolean;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  preferredColors: string[];
  lastActivity: Date;
}

interface SchemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  animationSpeed: number;
  complexity: 'minimal' | 'standard' | 'advanced';
  layout: 'compact' | 'comfortable' | 'spacious';
  accessibility: boolean;
}

const SCHEME_PRESETS: Record<string, SchemeConfig> = {
  beginner: {
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    accentColor: '#F59E0B',
    animationSpeed: 0.8,
    complexity: 'minimal',
    layout: 'spacious',
    accessibility: true
  },
  professional: {
    primaryColor: '#1F2937',
    secondaryColor: '#6366F1',
    accentColor: '#EC4899',
    animationSpeed: 1.2,
    complexity: 'advanced',
    layout: 'compact',
    accessibility: false
  },
  playful: {
    primaryColor: '#8B5CF6',
    secondaryColor: '#06B6D4',
    accentColor: '#F97316',
    animationSpeed: 1.5,
    complexity: 'standard',
    layout: 'comfortable',
    accessibility: false
  }
};

export function useIntelligentScheme() {
  const [behavior, setBehavior] = useState<UserBehavior>({
    interactionCount: 0,
    timeSpent: 0,
    preferredSections: [],
    deviceType: 'desktop',
    accessibilityNeeds: false,
    skillLevel: 'beginner',
    preferredColors: [],
    lastActivity: new Date()
  });

  const [currentScheme, setCurrentScheme] = useState<SchemeConfig>(SCHEME_PRESETS.beginner);
  const [adaptationHistory, setAdaptationHistory] = useState<string[]>([]);

  // Track user interactions
  const trackInteraction = useCallback((section: string, duration: number = 0) => {
    setBehavior(prev => {
      const newBehavior = {
        ...prev,
        interactionCount: prev.interactionCount + 1,
        timeSpent: prev.timeSpent + duration,
        preferredSections: [...new Set([...prev.preferredSections, section])],
        lastActivity: new Date()
      };

      // Determine skill level based on interactions
      if (newBehavior.interactionCount > 100) {
        newBehavior.skillLevel = 'advanced';
      } else if (newBehavior.interactionCount > 20) {
        newBehavior.skillLevel = 'intermediate';
      }

      return newBehavior;
    });
  }, []);

  // Detect device type
  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth;
      let deviceType: UserBehavior['deviceType'];
      
      if (width < 768) deviceType = 'mobile';
      else if (width < 1024) deviceType = 'tablet';
      else deviceType = 'desktop';

      setBehavior(prev => ({ ...prev, deviceType }));
    };

    detectDevice();
    window.addEventListener('resize', detectDevice);
    return () => window.removeEventListener('resize', detectDevice);
  }, []);

  // Detect accessibility preferences
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    setBehavior(prev => ({
      ...prev,
      accessibilityNeeds: prefersReducedMotion || prefersHighContrast
    }));
  }, []);

  // Intelligent scheme adaptation
  const adaptScheme = useCallback(() => {
    const { skillLevel, deviceType, accessibilityNeeds, interactionCount, timeSpent } = behavior;

    let newScheme: SchemeConfig;

    // Base scheme selection
    if (skillLevel === 'advanced' && timeSpent > 3600) {
      newScheme = { ...SCHEME_PRESETS.professional };
    } else if (interactionCount > 50 && !accessibilityNeeds) {
      newScheme = { ...SCHEME_PRESETS.playful };
    } else {
      newScheme = { ...SCHEME_PRESETS.beginner };
    }

    // Device-specific adjustments
    if (deviceType === 'mobile') {
      newScheme.layout = 'compact';
      newScheme.animationSpeed *= 0.8;
    } else if (deviceType === 'tablet') {
      newScheme.layout = 'comfortable';
    }

    // Accessibility adjustments
    if (accessibilityNeeds) {
      newScheme.animationSpeed = 0.5;
      newScheme.accessibility = true;
      newScheme.primaryColor = '#1F2937'; // High contrast
    }

    // Time-based adaptations
    const hour = new Date().getHours();
    if (hour >= 18 || hour <= 6) {
      // Dark mode preferences for evening/night
      newScheme.primaryColor = '#111827';
      newScheme.secondaryColor = '#374151';
    }

    setCurrentScheme(newScheme);
    setAdaptationHistory(prev => [...prev, `Adapted to ${skillLevel} user at ${new Date().toISOString()}`]);
  }, [behavior]);

  // Auto-adapt every 30 seconds
  useEffect(() => {
    const interval = setInterval(adaptScheme, 30000);
    return () => clearInterval(interval);
  }, [adaptScheme]);

  // Manual scheme override
  const setScheme = useCallback((schemeKey: keyof typeof SCHEME_PRESETS) => {
    setCurrentScheme(SCHEME_PRESETS[schemeKey]);
    setAdaptationHistory(prev => [...prev, `Manual override to ${schemeKey} at ${new Date().toISOString()}`]);
  }, []);

  // Get personalized recommendations
  const getRecommendations = useCallback(() => {
    const { skillLevel, preferredSections, interactionCount } = behavior;
    
    const recommendations = [];

    if (skillLevel === 'beginner' && interactionCount < 5) {
      recommendations.push({
        type: 'tutorial',
        title: 'Start with the basics',
        description: 'Let me show you around the platform',
        action: 'start-tour'
      });
    }

    if (preferredSections.includes('trading') && skillLevel === 'intermediate') {
      recommendations.push({
        type: 'feature',
        title: 'Try advanced order types',
        description: 'You might like stop-loss and limit orders',
        action: 'show-advanced-trading'
      });
    }

    if (interactionCount > 50 && !preferredSections.includes('portfolio')) {
      recommendations.push({
        type: 'suggestion',
        title: 'Check your portfolio',
        description: 'Track your performance and analytics',
        action: 'goto-portfolio'
      });
    }

    return recommendations;
  }, [behavior]);

  return {
    currentScheme,
    behavior,
    adaptationHistory,
    trackInteraction,
    adaptScheme,
    setScheme,
    getRecommendations
  };
}