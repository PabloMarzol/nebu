// Adaptive Sound Design System for NebulaX Exchange
// Provides contextual audio feedback for user interactions

export type SoundCategory = 
  | 'ui' 
  | 'trading' 
  | 'notification' 
  | 'success' 
  | 'error' 
  | 'ambient' 
  | 'navigation'
  | 'data';

export type SoundEvent = 
  // UI Interactions
  | 'button_click'
  | 'button_hover'
  | 'modal_open'
  | 'modal_close'
  | 'tab_switch'
  | 'dropdown_open'
  | 'dropdown_close'
  
  // Trading Sounds
  | 'order_placed'
  | 'order_filled'
  | 'order_cancelled'
  | 'trade_executed'
  | 'price_alert'
  | 'market_open'
  | 'market_close'
  
  // Notifications
  | 'notification_info'
  | 'notification_warning'
  | 'notification_error'
  | 'notification_success'
  | 'message_received'
  
  // Success/Error
  | 'success_chime'
  | 'error_buzz'
  | 'warning_tone'
  | 'confirmation'
  
  // Navigation
  | 'page_transition'
  | 'menu_open'
  | 'menu_close'
  | 'nav_click'
  
  // Data/Live Updates
  | 'data_update'
  | 'price_tick_up'
  | 'price_tick_down'
  | 'connection_established'
  | 'connection_lost'
  
  // Ambient
  | 'ambient_trading_floor'
  | 'ambient_data_stream'
  | 'ambient_space';

export interface SoundSettings {
  enabled: boolean;
  masterVolume: number;
  categoryVolumes: Record<SoundCategory, number>;
  muteCategories: SoundCategory[];
  adaptiveMode: boolean;
  spatialAudio: boolean;
  theme: 'minimal' | 'futuristic' | 'classic' | 'cyberpunk';
}

export interface SoundDefinition {
  category: SoundCategory;
  frequency: number; // Hz
  duration: number; // ms
  volume: number; // 0-1
  waveform: 'sine' | 'square' | 'sawtooth' | 'triangle';
  envelope?: {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
  };
  effects?: {
    reverb?: number;
    delay?: number;
    filter?: {
      type: 'lowpass' | 'highpass' | 'bandpass';
      frequency: number;
      Q: number;
    };
  };
}

class AdaptiveSoundEngine {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private settings: SoundSettings;
  private soundDefinitions: Map<SoundEvent, SoundDefinition> = new Map();
  private isInitialized = false;
  private currentTheme: SoundSettings['theme'] = 'futuristic';
  
  constructor() {
    this.settings = this.getDefaultSettings();
    this.initializeSoundLibrary();
  }

  private getDefaultSettings(): SoundSettings {
    const saved = localStorage.getItem('nebulax_sound_settings');
    if (saved) {
      return { ...this.getFactorySettings(), ...JSON.parse(saved) };
    }
    return this.getFactorySettings();
  }

  private getFactorySettings(): SoundSettings {
    return {
      enabled: true,
      masterVolume: 0.7,
      categoryVolumes: {
        ui: 0.6,
        trading: 0.8,
        notification: 0.9,
        success: 0.7,
        error: 0.8,
        ambient: 0.3,
        navigation: 0.5,
        data: 0.4
      },
      muteCategories: [],
      adaptiveMode: true,
      spatialAudio: false,
      theme: 'futuristic'
    };
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = this.settings.masterVolume;
      
      // Resume context on user interaction (required by browsers)
      if (this.audioContext.state === 'suspended') {
        document.addEventListener('click', this.resumeAudioContext, { once: true });
        document.addEventListener('keydown', this.resumeAudioContext, { once: true });
      }
      
      this.isInitialized = true;
      console.log('[AdaptiveSound] Engine initialized successfully');
    } catch (error) {
      console.warn('[AdaptiveSound] Failed to initialize audio context:', error);
    }
  }

  private resumeAudioContext = async () => {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
      console.log('[AdaptiveSound] Audio context resumed');
    }
  };

  private initializeSoundLibrary(): void {
    // UI Interaction Sounds
    this.soundDefinitions.set('button_click', {
      category: 'ui',
      frequency: 800,
      duration: 120,
      volume: 0.3,
      waveform: 'sine',
      envelope: { attack: 10, decay: 50, sustain: 0.3, release: 60 }
    });

    this.soundDefinitions.set('button_hover', {
      category: 'ui',
      frequency: 600,
      duration: 80,
      volume: 0.15,
      waveform: 'sine',
      envelope: { attack: 5, decay: 30, sustain: 0.2, release: 45 }
    });

    this.soundDefinitions.set('modal_open', {
      category: 'ui',
      frequency: 440,
      duration: 200,
      volume: 0.4,
      waveform: 'sine',
      envelope: { attack: 20, decay: 80, sustain: 0.4, release: 100 },
      effects: { reverb: 0.2 }
    });

    this.soundDefinitions.set('modal_close', {
      category: 'ui',
      frequency: 330,
      duration: 150,
      volume: 0.3,
      waveform: 'sine',
      envelope: { attack: 10, decay: 60, sustain: 0.2, release: 80 }
    });

    // Trading Sounds
    this.soundDefinitions.set('order_placed', {
      category: 'trading',
      frequency: 880,
      duration: 300,
      volume: 0.5,
      waveform: 'triangle',
      envelope: { attack: 15, decay: 100, sustain: 0.4, release: 185 }
    });

    this.soundDefinitions.set('order_filled', {
      category: 'trading',
      frequency: 1320,
      duration: 400,
      volume: 0.6,
      waveform: 'sine',
      envelope: { attack: 20, decay: 150, sustain: 0.5, release: 230 },
      effects: { reverb: 0.3 }
    });

    this.soundDefinitions.set('trade_executed', {
      category: 'trading',
      frequency: 1760,
      duration: 250,
      volume: 0.7,
      waveform: 'triangle',
      envelope: { attack: 25, decay: 75, sustain: 0.6, release: 150 }
    });

    // Price Movement Sounds
    this.soundDefinitions.set('price_tick_up', {
      category: 'data',
      frequency: 523, // C5
      duration: 100,
      volume: 0.25,
      waveform: 'sine',
      envelope: { attack: 5, decay: 30, sustain: 0.3, release: 65 }
    });

    this.soundDefinitions.set('price_tick_down', {
      category: 'data',
      frequency: 349, // F4
      duration: 120,
      volume: 0.25,
      waveform: 'sine',
      envelope: { attack: 5, decay: 40, sustain: 0.25, release: 75 }
    });

    // Notification Sounds
    this.soundDefinitions.set('notification_success', {
      category: 'success',
      frequency: 1047, // C6
      duration: 350,
      volume: 0.6,
      waveform: 'sine',
      envelope: { attack: 30, decay: 120, sustain: 0.5, release: 200 },
      effects: { reverb: 0.25 }
    });

    this.soundDefinitions.set('notification_error', {
      category: 'error',
      frequency: 200,
      duration: 400,
      volume: 0.7,
      waveform: 'sawtooth',
      envelope: { attack: 50, decay: 150, sustain: 0.4, release: 200 },
      effects: { 
        filter: { type: 'lowpass', frequency: 400, Q: 2 }
      }
    });

    this.soundDefinitions.set('notification_warning', {
      category: 'notification',
      frequency: 440,
      duration: 200,
      volume: 0.5,
      waveform: 'square',
      envelope: { attack: 20, decay: 80, sustain: 0.3, release: 100 }
    });

    // Navigation Sounds
    this.soundDefinitions.set('page_transition', {
      category: 'navigation',
      frequency: 660,
      duration: 180,
      volume: 0.3,
      waveform: 'sine',
      envelope: { attack: 15, decay: 70, sustain: 0.3, release: 95 }
    });

    this.soundDefinitions.set('menu_open', {
      category: 'navigation',
      frequency: 880,
      duration: 150,
      volume: 0.4,
      waveform: 'triangle',
      envelope: { attack: 10, decay: 60, sustain: 0.4, release: 80 }
    });

    // Data Connection Sounds
    this.soundDefinitions.set('connection_established', {
      category: 'data',
      frequency: 1320,
      duration: 300,
      volume: 0.4,
      waveform: 'sine',
      envelope: { attack: 20, decay: 100, sustain: 0.5, release: 180 },
      effects: { reverb: 0.15 }
    });

    this.soundDefinitions.set('connection_lost', {
      category: 'error',
      frequency: 220,
      duration: 500,
      volume: 0.5,
      waveform: 'square',
      envelope: { attack: 50, decay: 200, sustain: 0.3, release: 250 },
      effects: { 
        filter: { type: 'lowpass', frequency: 300, Q: 1.5 }
      }
    });
  }

  async playSound(event: SoundEvent, options?: { volume?: number; pitch?: number }): Promise<void> {
    if (!this.settings.enabled || !this.isInitialized || !this.audioContext || !this.gainNode) {
      return;
    }

    const soundDef = this.soundDefinitions.get(event);
    if (!soundDef) {
      console.warn(`[AdaptiveSound] Sound not found: ${event}`);
      return;
    }

    // Check if category is muted
    if (this.settings.muteCategories.includes(soundDef.category)) {
      return;
    }

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(this.gainNode);

      // Configure oscillator
      const frequency = soundDef.frequency * (options?.pitch || 1);
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = soundDef.waveform;

      // Calculate final volume
      const categoryVolume = this.settings.categoryVolumes[soundDef.category] || 1;
      const eventVolume = options?.volume || soundDef.volume;
      const finalVolume = eventVolume * categoryVolume * this.settings.masterVolume;

      // Apply envelope
      const now = this.audioContext.currentTime;
      const envelope = soundDef.envelope;
      
      if (envelope) {
        const attackTime = envelope.attack / 1000;
        const decayTime = envelope.decay / 1000;
        const releaseTime = envelope.release / 1000;
        const totalDuration = soundDef.duration / 1000;
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(finalVolume, now + attackTime);
        gainNode.gain.linearRampToValueAtTime(finalVolume * envelope.sustain, now + attackTime + decayTime);
        gainNode.gain.setValueAtTime(finalVolume * envelope.sustain, now + totalDuration - releaseTime);
        gainNode.gain.linearRampToValueAtTime(0, now + totalDuration);
      } else {
        gainNode.gain.setValueAtTime(finalVolume, now);
        gainNode.gain.linearRampToValueAtTime(0, now + soundDef.duration / 1000);
      }

      // Apply effects (basic implementation)
      if (soundDef.effects?.filter) {
        const filter = this.audioContext.createBiquadFilter();
        filter.type = soundDef.effects.filter.type;
        filter.frequency.setValueAtTime(soundDef.effects.filter.frequency, now);
        filter.Q.setValueAtTime(soundDef.effects.filter.Q, now);
        
        oscillator.disconnect();
        oscillator.connect(filter);
        filter.connect(gainNode);
      }

      // Start and stop
      oscillator.start(now);
      oscillator.stop(now + soundDef.duration / 1000);

    } catch (error) {
      console.warn(`[AdaptiveSound] Failed to play sound ${event}:`, error);
    }
  }

  updateSettings(newSettings: Partial<SoundSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    
    if (this.gainNode && newSettings.masterVolume !== undefined) {
      this.gainNode.gain.value = newSettings.masterVolume;
    }
    
    localStorage.setItem('nebulax_sound_settings', JSON.stringify(this.settings));
  }

  getSettings(): SoundSettings {
    return { ...this.settings };
  }

  setTheme(theme: SoundSettings['theme']): void {
    this.currentTheme = theme;
    this.updateSettings({ theme });
    this.adjustSoundsForTheme(theme);
  }

  private adjustSoundsForTheme(theme: SoundSettings['theme']): void {
    // Adjust sound parameters based on theme
    switch (theme) {
      case 'minimal':
        this.updateSettings({
          categoryVolumes: {
            ...this.settings.categoryVolumes,
            ui: 0.3,
            ambient: 0.1
          }
        });
        break;
      case 'cyberpunk':
        this.updateSettings({
          categoryVolumes: {
            ...this.settings.categoryVolumes,
            ui: 0.8,
            data: 0.6,
            ambient: 0.5
          }
        });
        break;
      case 'futuristic':
        // Default settings
        break;
      case 'classic':
        this.updateSettings({
          categoryVolumes: {
            ...this.settings.categoryVolumes,
            trading: 0.9,
            notification: 0.8
          }
        });
        break;
    }
  }

  mute(): void {
    this.updateSettings({ enabled: false });
  }

  unmute(): void {
    this.updateSettings({ enabled: true });
  }

  toggleMute(): void {
    this.updateSettings({ enabled: !this.settings.enabled });
  }

  muteCategory(category: SoundCategory): void {
    const muteCategories = [...this.settings.muteCategories];
    if (!muteCategories.includes(category)) {
      muteCategories.push(category);
      this.updateSettings({ muteCategories });
    }
  }

  unmuteCategory(category: SoundCategory): void {
    const muteCategories = this.settings.muteCategories.filter(c => c !== category);
    this.updateSettings({ muteCategories });
  }

  // Convenience methods for common sounds
  click = () => this.playSound('button_click');
  hover = () => this.playSound('button_hover');
  success = () => this.playSound('notification_success');
  error = () => this.playSound('notification_error');
  warning = () => this.playSound('notification_warning');
  orderPlaced = () => this.playSound('order_placed');
  orderFilled = () => this.playSound('order_filled');
  priceUp = () => this.playSound('price_tick_up');
  priceDown = () => this.playSound('price_tick_down');
  modalOpen = () => this.playSound('modal_open');
  modalClose = () => this.playSound('modal_close');
  pageTransition = () => this.playSound('page_transition');
  dataUpdate = () => this.playSound('data_update');
}

// Global instance
export const adaptiveSound = new AdaptiveSoundEngine();

// Initialize on module load
adaptiveSound.initialize();

// Export types and instance
export default adaptiveSound;