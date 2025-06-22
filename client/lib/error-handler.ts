import { SymptomCheckerResponse } from './gemini';
import { responseFormatter } from './response-formatter';

export enum ErrorType {
  API_KEY_MISSING = 'API_KEY_MISSING',
  API_QUOTA_EXCEEDED = 'API_QUOTA_EXCEEDED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INVALID_REQUEST = 'INVALID_REQUEST',
  RATE_LIMITED = 'RATE_LIMITED',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface ErrorInfo {
  type: ErrorType;
  message: string;
  userMessage: string;
  fallbackResponse: SymptomCheckerResponse;
  retryable: boolean;
}

class SymptomCheckerErrorHandler {
  /**
   * Handle and categorize errors from the Gemini API
   */
  handleError(error: any): ErrorInfo {
    console.error('Symptom Checker Error:', error);

    // Check for specific error types
    if (this.isApiKeyError(error)) {
      return this.createErrorInfo(ErrorType.API_KEY_MISSING, error);
    }

    if (this.isQuotaError(error)) {
      return this.createErrorInfo(ErrorType.API_QUOTA_EXCEEDED, error);
    }

    if (this.isNetworkError(error)) {
      return this.createErrorInfo(ErrorType.NETWORK_ERROR, error);
    }

    if (this.isRateLimitError(error)) {
      return this.createErrorInfo(ErrorType.RATE_LIMITED, error);
    }

    if (this.isServiceUnavailableError(error)) {
      return this.createErrorInfo(ErrorType.SERVICE_UNAVAILABLE, error);
    }

    if (this.isInvalidRequestError(error)) {
      return this.createErrorInfo(ErrorType.INVALID_REQUEST, error);
    }

    // Default to unknown error
    return this.createErrorInfo(ErrorType.UNKNOWN_ERROR, error);
  }

  /**
   * Create error information object
   */
  private createErrorInfo(type: ErrorType, error: any): ErrorInfo {
    const errorMessages = this.getErrorMessages(type);
    const fallbackResponse = this.getFallbackResponse(type);

    return {
      type,
      message: error?.message || 'Unknown error occurred',
      userMessage: errorMessages.userMessage,
      fallbackResponse,
      retryable: errorMessages.retryable
    };
  }

  /**
   * Get user-friendly error messages
   */
  private getErrorMessages(type: ErrorType): { userMessage: string; retryable: boolean } {
    switch (type) {
      case ErrorType.API_KEY_MISSING:
        return {
          userMessage: "The AI service is currently not configured properly. Please contact support.",
          retryable: false
        };

      case ErrorType.API_QUOTA_EXCEEDED:
        return {
          userMessage: "The AI service has reached its daily limit. Please try again tomorrow or contact support.",
          retryable: false
        };

      case ErrorType.NETWORK_ERROR:
        return {
          userMessage: "Unable to connect to the AI service. Please check your internet connection and try again.",
          retryable: true
        };

      case ErrorType.RATE_LIMITED:
        return {
          userMessage: "Too many requests. Please wait a moment and try again.",
          retryable: true
        };

      case ErrorType.SERVICE_UNAVAILABLE:
        return {
          userMessage: "The AI service is temporarily unavailable. Please try again in a few minutes.",
          retryable: true
        };

      case ErrorType.INVALID_REQUEST:
        return {
          userMessage: "There was an issue with your request. Please try rephrasing your symptoms.",
          retryable: true
        };

      default:
        return {
          userMessage: "An unexpected error occurred. Please try again or contact support if the problem persists.",
          retryable: true
        };
    }
  }

  /**
   * Get fallback response based on error type
   */
  private getFallbackResponse(type: ErrorType): SymptomCheckerResponse {
    let fallbackMessage = "";

    switch (type) {
      case ErrorType.API_KEY_MISSING:
      case ErrorType.API_QUOTA_EXCEEDED:
        fallbackMessage = this.getServiceUnavailableFallback();
        break;

      case ErrorType.NETWORK_ERROR:
        fallbackMessage = this.getNetworkErrorFallback();
        break;

      case ErrorType.RATE_LIMITED:
        fallbackMessage = this.getRateLimitFallback();
        break;

      case ErrorType.SERVICE_UNAVAILABLE:
        fallbackMessage = this.getServiceUnavailableFallback();
        break;

      default:
        fallbackMessage = this.getGenericFallback();
        break;
    }

    const formattedResponse = responseFormatter.formatResponse(fallbackMessage);

    return {
      message: fallbackMessage,
      formattedResponse,
      urgencyLevel: 'medium',
      disclaimer: "This is a fallback response due to technical difficulties. For medical concerns, please consult with a healthcare provider."
    };
  }

  /**
   * Fallback responses for different scenarios
   */
  private getServiceUnavailableFallback(): string {
    return `I apologize, but the AI symptom checker is currently unavailable due to technical issues.

**What you can do right now:**

**For non-emergency symptoms:**
• Monitor your symptoms and note any changes
• Try basic home remedies if appropriate (rest, hydration, over-the-counter medications)
• Schedule an appointment with your healthcare provider
• Use reputable medical websites for general information

**For concerning symptoms:**
• Contact your doctor's office or urgent care
• Call a nurse hotline if available
• Visit a walk-in clinic

**For emergency symptoms:**
• Call emergency services (911) immediately
• Go to the nearest emergency room
• Don't wait for the AI service to be restored

**Common emergency signs:**
• Severe chest pain or difficulty breathing
• Signs of stroke (sudden weakness, speech problems, severe headache)
• Severe allergic reactions
• High fever with stiff neck
• Severe abdominal pain
• Heavy bleeding or loss of consciousness

Please don't rely solely on AI for medical advice. When in doubt, consult with healthcare professionals.`;
  }

  private getNetworkErrorFallback(): string {
    return `I'm having trouble connecting to provide you with AI-powered symptom analysis right now.

**Immediate steps:**
• Check your internet connection
• Try refreshing the page
• Wait a moment and try again

**While you wait:**
• Note down your symptoms, when they started, and their severity
• Consider if this might be an emergency requiring immediate attention
• If symptoms are severe or worsening, don't wait - contact healthcare services

**Emergency warning signs that need immediate attention:**
• Difficulty breathing or chest pain
• Severe headache or confusion
• High fever or signs of serious infection
• Severe pain or bleeding
• Loss of consciousness

For non-emergency symptoms, you can also:
• Contact your healthcare provider
• Use other reliable medical resources
• Visit an urgent care center if needed

Your health and safety are the priority - don't hesitate to seek professional medical help when needed.`;
  }

  private getRateLimitFallback(): string {
    return `I need a moment to process your request. The system is currently handling many users.

**Please try again in a few minutes.**

**In the meantime:**
• If this is an emergency, don't wait - call 911 or go to the emergency room
• For urgent symptoms, contact your healthcare provider
• Note down your symptoms and when they started
• Consider the severity and whether immediate care is needed

**Seek immediate medical attention if you experience:**
• Severe chest pain or difficulty breathing
• Signs of stroke or severe headache
• High fever or signs of serious infection
• Severe allergic reactions
• Heavy bleeding or severe pain

Remember: AI symptom checking is helpful for guidance, but it's not a substitute for professional medical care when you're concerned about your health.`;
  }

  private getGenericFallback(): string {
    return `I'm experiencing technical difficulties and can't provide AI symptom analysis right now.

**For your safety:**

**If this is an emergency:** Call 911 or go to the emergency room immediately

**For urgent symptoms:** Contact your healthcare provider or urgent care

**For general symptoms:** 
• Monitor how you're feeling
• Note symptom details (when started, severity, changes)
• Consider basic care (rest, hydration, appropriate over-the-counter medications)
• Schedule a healthcare appointment if symptoms persist or worsen

**When to seek immediate care:**
• Severe or worsening symptoms
• Difficulty breathing or chest pain
• High fever or signs of infection
• Severe headache or neurological symptoms
• Allergic reactions or severe pain

**Remember:** This AI tool is meant to supplement, not replace, professional medical advice. When in doubt about your health, always consult with qualified healthcare providers.

I apologize for the inconvenience and hope to be back online soon to help with your health questions.`;
  }

  // Error detection methods
  private isApiKeyError(error: any): boolean {
    return error?.message?.includes('API key') || 
           error?.message?.includes('authentication') ||
           error?.status === 401;
  }

  private isQuotaError(error: any): boolean {
    return error?.message?.includes('quota') || 
           error?.message?.includes('limit exceeded') ||
           error?.status === 429;
  }

  private isNetworkError(error: any): boolean {
    return error?.message?.includes('network') || 
           error?.message?.includes('fetch') ||
           error?.code === 'NETWORK_ERROR' ||
           !navigator.onLine;
  }

  private isRateLimitError(error: any): boolean {
    return error?.status === 429 || 
           error?.message?.includes('rate limit');
  }

  private isServiceUnavailableError(error: any): boolean {
    return error?.status === 503 || 
           error?.status === 502 ||
           error?.message?.includes('service unavailable');
  }

  private isInvalidRequestError(error: any): boolean {
    return error?.status === 400 || 
           error?.message?.includes('invalid request');
  }
}

// Export singleton instance
export const errorHandler = new SymptomCheckerErrorHandler();

// Export class for testing
export { SymptomCheckerErrorHandler };
