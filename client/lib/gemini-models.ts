import { GoogleGenerativeAI } from '@google/generative-ai';

// Available Gemini models to try
export const AVAILABLE_MODELS = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-pro',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro-latest'
];

export async function findWorkingModel(apiKey: string): Promise<string | null> {
  const genAI = new GoogleGenerativeAI(apiKey);
  
  for (const modelName of AVAILABLE_MODELS) {
    try {
      console.log(`Testing model: ${modelName}`);
      
      const model = genAI.getGenerativeModel({ model: modelName });
      
      // Test with a simple prompt
      const result = await model.generateContent('Hello, respond with "OK" if you can understand this.');
      const response = await result.response;
      const text = response.text();
      
      if (text && text.trim().length > 0) {
        console.log(`✅ Working model found: ${modelName}`);
        return modelName;
      }
    } catch (error) {
      console.log(`❌ Model ${modelName} failed:`, error);
      continue;
    }
  }
  
  console.error('❌ No working model found');
  return null;
}

export async function listAvailableModels(apiKey: string): Promise<string[]> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Note: The listModels method might not be available in the client SDK
    // This is more for reference and debugging
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    
    if (response.ok) {
      const data = await response.json();
      return data.models?.map((model: any) => model.name) || [];
    }
  } catch (error) {
    console.error('Error listing models:', error);
  }
  
  return [];
}

export function getModelConfiguration(modelName: string) {
  // Different models might need different configurations
  const configs: Record<string, any> = {
    'gemini-1.5-flash': {
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 2048,
    },
    'gemini-1.5-pro': {
      temperature: 0.7,
      topP: 0.9,
      topK: 32,
      maxOutputTokens: 4096,
    },
    'gemini-pro': {
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 2048,
    }
  };
  
  return configs[modelName] || configs['gemini-1.5-flash'];
}
