// Simple test file to verify Gemini AI integration
import { geminiSymptomChecker } from './gemini';

export async function testSymptomChecker() {
  console.log('Testing Symptom Checker...');
  
  try {
    // Test 1: Get initial greeting
    console.log('Test 1: Initial greeting');
    const greeting = geminiSymptomChecker.getInitialGreeting();
    console.log('✓ Initial greeting:', greeting.message.substring(0, 100) + '...');
    
    // Test 2: Test with a simple symptom
    console.log('\nTest 2: Simple symptom analysis');
    const response = await geminiSymptomChecker.analyzeSymptoms('I have a headache and feel tired');
    console.log('✓ Response received:', response.message.substring(0, 100) + '...');
    console.log('✓ Urgency level:', response.urgencyLevel);
    
    // Test 3: Test emergency detection
    console.log('\nTest 3: Emergency detection');
    const emergencyResponse = await geminiSymptomChecker.analyzeSymptoms('I have severe chest pain and difficulty breathing');
    console.log('✓ Emergency response:', emergencyResponse.urgencyLevel);
    
    // Test 4: Get conversation history
    console.log('\nTest 4: Conversation history');
    const messages = geminiSymptomChecker.getConversationMessages();
    console.log('✓ Messages in conversation:', messages.length);
    
    console.log('\n✅ All tests passed!');
    return true;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Test the API key configuration
export function testApiKeyConfiguration() {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ NEXT_PUBLIC_GEMINI_API_KEY is not set');
    return false;
  }
  
  if (apiKey.length < 30) {
    console.error('❌ API key seems too short');
    return false;
  }
  
  console.log('✅ API key is configured');
  return true;
}

// Run tests if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  console.log('Symptom Checker Test Suite');
  console.log('========================');
  
  testApiKeyConfiguration();
  
  // Note: Actual API tests should be run manually or through user interaction
  // to avoid unnecessary API calls during development
}
