// Speech Recognition Service using Web Speech API
export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface SpeechRecognitionConfig {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
}

export type SpeechRecognitionCallback = (result: SpeechRecognitionResult) => void;
export type SpeechRecognitionErrorCallback = (error: string) => void;

class SpeechRecognitionService {
  private recognition: any = null;
  private isSupported: boolean = false;
  private isListening: boolean = false;
  private config: SpeechRecognitionConfig = {
    language: 'en-US',
    continuous: false,
    interimResults: true,
    maxAlternatives: 1
  };

  constructor() {
    this.initializeRecognition();
  }

  private initializeRecognition(): void {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      this.isSupported = false;
      return;
    }

    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported in this browser');
      this.isSupported = false;
      return;
    }

    this.isSupported = true;
    this.recognition = new SpeechRecognition();
    this.setupRecognition();
  }

  private setupRecognition(): void {
    if (!this.recognition) return;

    // Configure recognition
    this.recognition.continuous = this.config.continuous;
    this.recognition.interimResults = this.config.interimResults;
    this.recognition.lang = this.config.language;
    this.recognition.maxAlternatives = this.config.maxAlternatives;
  }

  /**
   * Check if speech recognition is supported
   */
  isRecognitionSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Check if currently listening
   */
  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  /**
   * Start speech recognition
   */
  startListening(
    onResult: SpeechRecognitionCallback,
    onError: SpeechRecognitionErrorCallback,
    onEnd?: () => void
  ): boolean {
    if (!this.isSupported || !this.recognition) {
      onError('Speech recognition not supported');
      return false;
    }

    if (this.isListening) {
      onError('Already listening');
      return false;
    }

    try {
      // Set up event listeners
      this.recognition.onresult = (event: any) => {
        const results = event.results;
        const lastResult = results[results.length - 1];
        
        if (lastResult) {
          const transcript = lastResult[0].transcript;
          const confidence = lastResult[0].confidence || 0;
          const isFinal = lastResult.isFinal;

          onResult({
            transcript: transcript.trim(),
            confidence,
            isFinal
          });
        }
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        this.isListening = false;
        
        let errorMessage = 'Speech recognition error';
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.';
            break;
          case 'audio-capture':
            errorMessage = 'Microphone not accessible. Please check permissions.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission denied. Please allow microphone access.';
            break;
          case 'network':
            errorMessage = 'Network error. Please check your connection.';
            break;
          case 'service-not-allowed':
            errorMessage = 'Speech recognition service not allowed.';
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }
        
        onError(errorMessage);
      };

      this.recognition.onstart = () => {
        console.log('Speech recognition started');
        this.isListening = true;
      };

      this.recognition.onend = () => {
        console.log('Speech recognition ended');
        this.isListening = false;
        if (onEnd) onEnd();
      };

      // Start recognition
      this.recognition.start();
      return true;

    } catch (error) {
      console.error('Error starting speech recognition:', error);
      onError('Failed to start speech recognition');
      return false;
    }
  }

  /**
   * Stop speech recognition
   */
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * Abort speech recognition
   */
  abortListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.abort();
      this.isListening = false;
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<SpeechRecognitionConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.setupRecognition();
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages(): string[] {
    // Common supported languages
    return [
      'en-US', 'en-GB', 'en-AU', 'en-CA', 'en-IN',
      'es-ES', 'es-MX', 'fr-FR', 'de-DE', 'it-IT',
      'pt-BR', 'ru-RU', 'ja-JP', 'ko-KR', 'zh-CN',
      'hi-IN', 'ar-SA', 'nl-NL', 'sv-SE', 'da-DK'
    ];
  }

  /**
   * Request microphone permission
   */
  async requestMicrophonePermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !navigator.mediaDevices) {
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately as we just needed permission
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  }

  /**
   * Check microphone permission status
   */
  async checkMicrophonePermission(): Promise<'granted' | 'denied' | 'prompt'> {
    if (typeof window === 'undefined' || !navigator.permissions) {
      return 'prompt';
    }

    try {
      const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      return permission.state;
    } catch (error) {
      console.warn('Could not check microphone permission:', error);
      return 'prompt';
    }
  }
}

// Lazy-loaded singleton instance
let speechRecognitionServiceInstance: SpeechRecognitionService | null = null;

export const speechRecognitionService = {
  getInstance(): SpeechRecognitionService {
    if (!speechRecognitionServiceInstance) {
      speechRecognitionServiceInstance = new SpeechRecognitionService();
    }
    return speechRecognitionServiceInstance;
  },

  // Proxy methods for backward compatibility
  isRecognitionSupported(): boolean {
    return this.getInstance().isRecognitionSupported();
  },

  isCurrentlyListening(): boolean {
    return this.getInstance().isCurrentlyListening();
  },

  startListening(
    onResult: SpeechRecognitionCallback,
    onError: SpeechRecognitionErrorCallback,
    onEnd?: () => void
  ): boolean {
    return this.getInstance().startListening(onResult, onError, onEnd);
  },

  stopListening(): void {
    return this.getInstance().stopListening();
  },

  abortListening(): void {
    return this.getInstance().abortListening();
  },

  updateConfig(newConfig: Partial<SpeechRecognitionConfig>): void {
    return this.getInstance().updateConfig(newConfig);
  },

  getSupportedLanguages(): string[] {
    return this.getInstance().getSupportedLanguages();
  },

  async requestMicrophonePermission(): Promise<boolean> {
    return this.getInstance().requestMicrophonePermission();
  },

  async checkMicrophonePermission(): Promise<'granted' | 'denied' | 'prompt'> {
    return this.getInstance().checkMicrophonePermission();
  }
};

// Export class for testing
export { SpeechRecognitionService };
