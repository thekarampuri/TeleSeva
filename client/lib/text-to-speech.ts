// Text-to-Speech Service using Web Speech Synthesis API
export interface TTSVoice {
  name: string;
  lang: string;
  gender?: 'male' | 'female';
  localService: boolean;
  default: boolean;
  voiceURI: string;
}

export interface TTSConfig {
  voice?: SpeechSynthesisVoice;
  rate: number;        // 0.1 to 10
  pitch: number;       // 0 to 2
  volume: number;      // 0 to 1
  language: string;
}

export interface TTSCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  onPause?: () => void;
  onResume?: () => void;
  onBoundary?: (event: SpeechSynthesisEvent) => void;
}

class TextToSpeechService {
  private synthesis: SpeechSynthesis;
  private isSupported: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;
  private isPaused: boolean = false;
  private availableVoices: SpeechSynthesisVoice[] = [];
  
  private config: TTSConfig = {
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    language: 'en-US'
  };

  constructor() {
    this.initializeTTS();
  }

  private initializeTTS(): void {
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
      this.isSupported = true;
      this.loadVoices();
      
      // Load voices when they become available
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => {
          this.loadVoices();
        };
      }
    } else {
      console.warn('Text-to-Speech not supported in this browser');
      this.isSupported = false;
    }
  }

  private loadVoices(): void {
    this.availableVoices = this.synthesis.getVoices();
    
    // Set default voice if not already set
    if (!this.config.voice && this.availableVoices.length > 0) {
      // Try to find a voice that matches the current language
      const preferredVoice = this.availableVoices.find(voice => 
        voice.lang.startsWith(this.config.language.split('-')[0])
      );
      
      this.config.voice = preferredVoice || this.availableVoices[0];
    }
  }

  /**
   * Check if TTS is supported
   */
  isTTSSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Check if currently speaking
   */
  isCurrentlySpeaking(): boolean {
    return this.isSpeaking && this.synthesis.speaking;
  }

  /**
   * Check if currently paused
   */
  isCurrentlyPaused(): boolean {
    return this.isPaused && this.synthesis.paused;
  }

  /**
   * Get available voices
   */
  getAvailableVoices(): TTSVoice[] {
    return this.availableVoices.map(voice => ({
      name: voice.name,
      lang: voice.lang,
      gender: this.detectGender(voice.name),
      localService: voice.localService,
      default: voice.default,
      voiceURI: voice.voiceURI
    }));
  }

  private detectGender(voiceName: string): 'male' | 'female' | undefined {
    const name = voiceName.toLowerCase();
    if (name.includes('female') || name.includes('woman') || name.includes('girl')) {
      return 'female';
    }
    if (name.includes('male') || name.includes('man') || name.includes('boy')) {
      return 'male';
    }
    // Common female voice names
    if (name.includes('samantha') || name.includes('susan') || name.includes('victoria') || 
        name.includes('karen') || name.includes('moira') || name.includes('tessa')) {
      return 'female';
    }
    // Common male voice names
    if (name.includes('alex') || name.includes('daniel') || name.includes('thomas') || 
        name.includes('fred') || name.includes('ralph')) {
      return 'male';
    }
    return undefined;
  }

  /**
   * Speak text
   */
  speak(text: string, callbacks?: TTSCallbacks): boolean {
    if (!this.isSupported) {
      callbacks?.onError?.('Text-to-Speech not supported');
      return false;
    }

    // Stop any current speech
    this.stop();

    try {
      // Clean text for better speech
      const cleanText = this.cleanTextForSpeech(text);
      
      if (!cleanText.trim()) {
        callbacks?.onError?.('No text to speak');
        return false;
      }

      // Create utterance
      this.currentUtterance = new SpeechSynthesisUtterance(cleanText);
      
      // Apply configuration
      this.currentUtterance.voice = this.config.voice || null;
      this.currentUtterance.rate = this.config.rate;
      this.currentUtterance.pitch = this.config.pitch;
      this.currentUtterance.volume = this.config.volume;
      this.currentUtterance.lang = this.config.language;

      // Set up event listeners
      this.currentUtterance.onstart = () => {
        this.isSpeaking = true;
        this.isPaused = false;
        callbacks?.onStart?.();
      };

      this.currentUtterance.onend = () => {
        this.isSpeaking = false;
        this.isPaused = false;
        this.currentUtterance = null;
        callbacks?.onEnd?.();
      };

      this.currentUtterance.onerror = (event) => {
        console.error('TTS Error:', event.error);
        this.isSpeaking = false;
        this.isPaused = false;
        this.currentUtterance = null;
        callbacks?.onError?.(event.error);
      };

      this.currentUtterance.onpause = () => {
        this.isPaused = true;
        callbacks?.onPause?.();
      };

      this.currentUtterance.onresume = () => {
        this.isPaused = false;
        callbacks?.onResume?.();
      };

      this.currentUtterance.onboundary = (event) => {
        callbacks?.onBoundary?.(event);
      };

      // Start speaking
      this.synthesis.speak(this.currentUtterance);
      return true;

    } catch (error) {
      console.error('Error starting TTS:', error);
      callbacks?.onError?.('Failed to start text-to-speech');
      return false;
    }
  }

  /**
   * Clean text for better speech synthesis
   */
  private cleanTextForSpeech(text: string): string {
    return text
      // Remove markdown formatting
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/#{1,6}\s/g, '')
      // Replace common symbols with words
      .replace(/&/g, ' and ')
      .replace(/@/g, ' at ')
      .replace(/#/g, ' hash ')
      .replace(/\$/g, ' dollar ')
      .replace(/%/g, ' percent ')
      // Remove URLs
      .replace(/https?:\/\/[^\s]+/g, '')
      // Clean up whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Pause speech
   */
  pause(): void {
    if (this.isSupported && this.synthesis.speaking && !this.synthesis.paused) {
      this.synthesis.pause();
    }
  }

  /**
   * Resume speech
   */
  resume(): void {
    if (this.isSupported && this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  /**
   * Stop speech
   */
  stop(): void {
    if (this.isSupported) {
      this.synthesis.cancel();
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentUtterance = null;
    }
  }

  /**
   * Update TTS configuration
   */
  updateConfig(newConfig: Partial<TTSConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Set voice by name
   */
  setVoiceByName(voiceName: string): boolean {
    const voice = this.availableVoices.find(v => v.name === voiceName);
    if (voice) {
      this.config.voice = voice;
      return true;
    }
    return false;
  }

  /**
   * Set voice by language
   */
  setVoiceByLanguage(language: string): boolean {
    const voice = this.availableVoices.find(v => v.lang.startsWith(language));
    if (voice) {
      this.config.voice = voice;
      this.config.language = language;
      return true;
    }
    return false;
  }

  /**
   * Get current configuration
   */
  getConfig(): TTSConfig {
    return { ...this.config };
  }

  /**
   * Get recommended voices for medical content
   */
  getMedicalVoices(): TTSVoice[] {
    const voices = this.getAvailableVoices();
    
    // Prefer clear, professional-sounding voices
    return voices.filter(voice => {
      const name = voice.name.toLowerCase();
      // Prefer voices that sound professional
      return !name.includes('novelty') && 
             !name.includes('whisper') && 
             !name.includes('robot') &&
             voice.localService; // Prefer local voices for better quality
    }).sort((a, b) => {
      // Prioritize English voices for medical content
      if (a.lang.startsWith('en') && !b.lang.startsWith('en')) return -1;
      if (!a.lang.startsWith('en') && b.lang.startsWith('en')) return 1;
      return 0;
    });
  }
}

// Export singleton instance
export const textToSpeechService = new TextToSpeechService();

// Export class for testing
export { TextToSpeechService };
