export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  hasAudio?: boolean;
  urgencyLevel?: 'low' | 'medium' | 'high' | 'emergency';
  symptoms?: string[];
  medicines?: string[];
  possibleConditions?: string[];
}

export interface PatientInfo {
  age?: number;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  medicalHistory?: string[];
  currentMedications?: string[];
  allergies?: string[];
  chronicConditions?: string[];
}

export interface ConversationSession {
  id: string;
  messages: Message[];
  patientInfo: PatientInfo;
  startTime: Date;
  lastActivity: Date;
  isActive: boolean;
  summary?: {
    mainSymptoms: string[];
    urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
    recommendedActions: string[];
  };
}

class ConversationContextManager {
  private currentSession: ConversationSession | null = null;
  private readonly MAX_MESSAGES = 50; // Limit conversation history
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  /**
   * Start a new conversation session
   */
  startNewSession(): ConversationSession {
    const sessionId = this.generateSessionId();
    
    this.currentSession = {
      id: sessionId,
      messages: [],
      patientInfo: {},
      startTime: new Date(),
      lastActivity: new Date(),
      isActive: true
    };

    // Add initial greeting message
    this.addBotMessage(
      "Hello! I'm Dr. AI, your medical assistant. I'm here to help you understand your symptoms and provide preliminary health guidance. Please describe your main health concern or symptoms you're experiencing.",
      { urgencyLevel: 'low' }
    );

    return this.currentSession;
  }

  /**
   * Get current active session
   */
  getCurrentSession(): ConversationSession | null {
    if (this.currentSession && this.isSessionActive()) {
      return this.currentSession;
    }
    return null;
  }

  /**
   * Add a user message to the conversation
   */
  addUserMessage(content: string): Message {
    if (!this.currentSession) {
      this.startNewSession();
    }

    const message: Message = {
      id: this.generateMessageId(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    this.currentSession!.messages.push(message);
    this.updateLastActivity();
    this.trimMessages();

    return message;
  }

  /**
   * Add a bot message to the conversation
   */
  addBotMessage(
    content: string, 
    metadata?: {
      urgencyLevel?: Message['urgencyLevel'];
      symptoms?: string[];
      medicines?: string[];
      possibleConditions?: string[];
    }
  ): Message {
    if (!this.currentSession) {
      this.startNewSession();
    }

    const message: Message = {
      id: this.generateMessageId(),
      type: 'bot',
      content,
      timestamp: new Date(),
      hasAudio: true,
      ...metadata
    };

    this.currentSession!.messages.push(message);
    this.updateLastActivity();
    this.trimMessages();

    // Update session summary based on the latest bot response
    this.updateSessionSummary(message);

    return message;
  }

  /**
   * Update patient information
   */
  updatePatientInfo(info: Partial<PatientInfo>): void {
    if (!this.currentSession) {
      this.startNewSession();
    }

    this.currentSession!.patientInfo = {
      ...this.currentSession!.patientInfo,
      ...info
    };
    this.updateLastActivity();
  }

  /**
   * Get conversation history for AI context
   */
  getConversationHistory(limit: number = 10): Array<{role: 'user' | 'model', content: string}> {
    if (!this.currentSession) {
      return [];
    }

    return this.currentSession.messages
      .slice(-limit)
      .map(msg => ({
        role: msg.type === 'user' ? 'user' as const : 'model' as const,
        content: msg.content
      }));
  }

  /**
   * Get patient context for AI
   */
  getPatientContext(): PatientInfo {
    return this.currentSession?.patientInfo || {};
  }

  /**
   * Extract symptoms mentioned in the conversation
   */
  extractSymptoms(): string[] {
    if (!this.currentSession) return [];

    const symptoms = new Set<string>();
    
    this.currentSession.messages.forEach(message => {
      if (message.symptoms) {
        message.symptoms.forEach(symptom => symptoms.add(symptom));
      }
    });

    return Array.from(symptoms);
  }

  /**
   * Get the highest urgency level from the conversation
   */
  getHighestUrgencyLevel(): 'low' | 'medium' | 'high' | 'emergency' {
    if (!this.currentSession) return 'low';

    const urgencyOrder = { 'low': 0, 'medium': 1, 'high': 2, 'emergency': 3 };
    let highestUrgency: 'low' | 'medium' | 'high' | 'emergency' = 'low';

    this.currentSession.messages.forEach(message => {
      if (message.urgencyLevel && urgencyOrder[message.urgencyLevel] > urgencyOrder[highestUrgency]) {
        highestUrgency = message.urgencyLevel;
      }
    });

    return highestUrgency;
  }

  /**
   * End the current session
   */
  endSession(): void {
    if (this.currentSession) {
      this.currentSession.isActive = false;
    }
  }

  /**
   * Clear conversation history
   */
  clearConversation(): void {
    this.currentSession = null;
  }

  /**
   * Check if current session is still active
   */
  private isSessionActive(): boolean {
    if (!this.currentSession) return false;
    
    const now = new Date().getTime();
    const lastActivity = this.currentSession.lastActivity.getTime();
    
    return (now - lastActivity) < this.SESSION_TIMEOUT && this.currentSession.isActive;
  }

  /**
   * Update last activity timestamp
   */
  private updateLastActivity(): void {
    if (this.currentSession) {
      this.currentSession.lastActivity = new Date();
    }
  }

  /**
   * Trim messages to prevent memory issues
   */
  private trimMessages(): void {
    if (this.currentSession && this.currentSession.messages.length > this.MAX_MESSAGES) {
      // Keep the first message (greeting) and the most recent messages
      const firstMessage = this.currentSession.messages[0];
      const recentMessages = this.currentSession.messages.slice(-this.MAX_MESSAGES + 1);
      this.currentSession.messages = [firstMessage, ...recentMessages];
    }
  }

  /**
   * Update session summary based on latest information
   */
  private updateSessionSummary(message: Message): void {
    if (!this.currentSession) return;

    const symptoms = this.extractSymptoms();
    const urgencyLevel = this.getHighestUrgencyLevel();

    this.currentSession.summary = {
      mainSymptoms: symptoms,
      urgencyLevel,
      recommendedActions: [] // Could be extracted from bot messages
    };
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Export session data for persistence
   */
  exportSession(): ConversationSession | null {
    return this.currentSession ? { ...this.currentSession } : null;
  }

  /**
   * Import session data from persistence
   */
  importSession(session: ConversationSession): void {
    this.currentSession = {
      ...session,
      lastActivity: new Date() // Update to current time
    };
  }
}

// Export singleton instance
export const conversationManager = new ConversationContextManager();

// Export class for testing
export { ConversationContextManager };
