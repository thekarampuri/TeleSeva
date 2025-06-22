import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYMPTOM_CHECKER_SYSTEM_PROMPT, INITIAL_GREETING, EMERGENCY_KEYWORDS } from './symptom-checker-prompts';
import { conversationManager, type Message, type PatientInfo } from './conversation-context';
import { responseFormatter, type FormattedResponse } from './response-formatter';
import { errorHandler } from './error-handler';
import { getModelConfiguration } from './gemini-models';

// Initialize the Gemini AI client
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  console.error('NEXT_PUBLIC_GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey || '');

// Get the generative model - using the correct model name for the current API
// Available models: gemini-1.5-flash, gemini-1.5-pro
const MODEL_NAME = 'gemini-1.5-flash';
const model = genAI.getGenerativeModel({
  model: MODEL_NAME,
  generationConfig: getModelConfiguration(MODEL_NAME),
});

export interface SymptomCheckerResponse {
  message: string;
  formattedResponse: FormattedResponse;
  symptoms?: string[];
  possibleConditions?: string[];
  recommendations?: string[];
  medicines?: string[];
  urgencyLevel?: 'low' | 'medium' | 'high' | 'emergency';
  disclaimer?: string;
}

class GeminiSymptomChecker {
  /**
   * Check for emergency keywords in user input
   */
  private checkForEmergency(userInput: string): boolean {
    const lowerInput = userInput.toLowerCase();
    return EMERGENCY_KEYWORDS.some(keyword => lowerInput.includes(keyword));
  }

  /**
   * Get emergency response
   */
  private getEmergencyResponse(): SymptomCheckerResponse {
    const emergencyMessage = `🚨 **EMERGENCY ALERT** 🚨

Based on the symptoms you've described, this could be a medical emergency that requires immediate attention.

**IMMEDIATE ACTION REQUIRED:**
• Call emergency services (911) immediately
• Go to the nearest emergency room
• Do not wait or try to treat this at home
• If possible, have someone accompany you

**While waiting for help:**
• Stay calm and try to remain still
• Do not take any medications unless prescribed
• Keep track of your symptoms
• Have your medical information ready

This is not a time for home remedies or waiting to see how you feel. Please seek immediate medical attention.

---
⚠️ This is an emergency assessment. Please contact emergency services immediately.`;

    const formattedResponse = responseFormatter.formatResponse(emergencyMessage);

    return {
      message: emergencyMessage,
      formattedResponse,
      urgencyLevel: 'emergency',
      disclaimer: "This is an emergency assessment. Please contact emergency services immediately."
    };
  }

  async analyzeSymptoms(
    userMessage: string,
    patientInfo?: Partial<PatientInfo>
  ): Promise<SymptomCheckerResponse> {
    try {
      // Check for emergency keywords first
      if (this.checkForEmergency(userMessage)) {
        // Add emergency message to conversation
        conversationManager.addUserMessage(userMessage);
        const emergencyResponse = this.getEmergencyResponse();
        conversationManager.addBotMessage(
          emergencyResponse.message,
          { urgencyLevel: 'emergency' }
        );
        return emergencyResponse;
      }

      // Add user message to conversation context
      conversationManager.addUserMessage(userMessage);

      // Update patient info if provided
      if (patientInfo) {
        conversationManager.updatePatientInfo(patientInfo);
      }

      // Get conversation history and patient context
      const conversationHistory = conversationManager.getConversationHistory(8);
      const patientContext = conversationManager.getPatientContext();

      // Build the prompt with full context
      const fullPrompt = this.buildPrompt(userMessage, conversationHistory, patientContext);

      // Generate response from Gemini
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      // Check if response is empty or invalid
      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from Gemini API');
      }

      // Format the response
      const formattedResponse = responseFormatter.formatResponse(text);

      // Add bot response to conversation context
      conversationManager.addBotMessage(
        text,
        {
          urgencyLevel: formattedResponse.urgencyLevel,
          symptoms: formattedResponse.sections.possibleConditions,
          medicines: formattedResponse.sections.medicines?.map(m => m.name)
        }
      );

      return {
        message: text,
        formattedResponse,
        urgencyLevel: formattedResponse.urgencyLevel,
        symptoms: formattedResponse.sections.possibleConditions,
        medicines: formattedResponse.sections.medicines?.map(m => m.name),
        disclaimer: formattedResponse.sections.disclaimer
      };
    } catch (error) {
      console.error('Error analyzing symptoms:', error);

      // Use error handler to get appropriate response
      const errorInfo = errorHandler.handleError(error);

      // Add error message to conversation
      conversationManager.addBotMessage(
        errorInfo.fallbackResponse.message,
        { urgencyLevel: errorInfo.fallbackResponse.urgencyLevel }
      );

      return errorInfo.fallbackResponse;
    }
  }

  private buildPrompt(
    userMessage: string,
    conversationHistory: Array<{role: 'user' | 'model', content: string}>,
    patientContext: PatientInfo
  ): string {
    let prompt = SYMPTOM_CHECKER_SYSTEM_PROMPT + '\n\n';

    // Add conversation history for context
    if (conversationHistory.length > 0) {
      prompt += 'CONVERSATION HISTORY:\n';
      conversationHistory.forEach((msg) => {
        prompt += `${msg.role.toUpperCase()}: ${msg.content}\n`;
      });
      prompt += '\n';
    }

    // Add patient context if available
    if (Object.keys(patientContext).length > 0) {
      prompt += 'PATIENT INFORMATION:\n';
      if (patientContext.age) prompt += `Age: ${patientContext.age}\n`;
      if (patientContext.gender) prompt += `Gender: ${patientContext.gender}\n`;
      if (patientContext.medicalHistory?.length) {
        prompt += `Medical History: ${patientContext.medicalHistory.join(', ')}\n`;
      }
      if (patientContext.currentMedications?.length) {
        prompt += `Current Medications: ${patientContext.currentMedications.join(', ')}\n`;
      }
      if (patientContext.allergies?.length) {
        prompt += `Allergies: ${patientContext.allergies.join(', ')}\n`;
      }
      if (patientContext.chronicConditions?.length) {
        prompt += `Chronic Conditions: ${patientContext.chronicConditions.join(', ')}\n`;
      }
      prompt += '\n';
    }

    prompt += `CURRENT USER MESSAGE: ${userMessage}\n\n`;
    prompt += 'Please provide a comprehensive response following the guidelines above, using the structured format with clear sections for acknowledgment, analysis, questions, possible conditions, recommendations, medications, and urgency level.';

    return prompt;
  }

  /**
   * Get initial greeting message
   */
  getInitialGreeting(): SymptomCheckerResponse {
    const formattedResponse = responseFormatter.formatResponse(INITIAL_GREETING);

    // Start new conversation session
    conversationManager.startNewSession();

    return {
      message: INITIAL_GREETING,
      formattedResponse,
      urgencyLevel: 'low',
      disclaimer: "This AI assessment is for informational purposes only and does not replace professional medical advice."
    };
  }

  private getErrorResponse(): SymptomCheckerResponse {
    const errorMessage = "I apologize, but I'm experiencing technical difficulties right now. Please try again in a moment, or if you're experiencing serious symptoms, please contact a healthcare provider or emergency services immediately.";

    const formattedResponse = responseFormatter.formatResponse(errorMessage);

    return {
      message: errorMessage,
      formattedResponse,
      urgencyLevel: 'medium',
      disclaimer: "This information is for educational purposes only and should not replace professional medical advice. Please consult with a healthcare provider for proper diagnosis and treatment."
    };
  }

  /**
   * Clear conversation history
   */
  clearConversation(): void {
    conversationManager.clearConversation();
  }

  /**
   * Get conversation messages for UI
   */
  getConversationMessages(): Message[] {
    const session = conversationManager.getCurrentSession();
    return session?.messages || [];
  }

  /**
   * Update patient information
   */
  updatePatientInfo(info: Partial<PatientInfo>): void {
    conversationManager.updatePatientInfo(info);
  }
}

// Export a singleton instance
export const geminiSymptomChecker = new GeminiSymptomChecker();

// Export the class for testing or multiple instances
export { GeminiSymptomChecker };
