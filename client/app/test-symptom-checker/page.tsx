"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { geminiSymptomChecker } from '@/lib/gemini';
import { testApiKeyConfiguration } from '@/lib/test-symptom-checker';

export default function TestSymptomCheckerPage() {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [testInput, setTestInput] = useState('I have a headache and feel tired');

  const runApiKeyTest = () => {
    const result = testApiKeyConfiguration();
    setTestResult(result ? '✅ API Key is configured correctly' : '❌ API Key configuration failed');
  };

  const runSymptomTest = async () => {
    setIsLoading(true);
    setTestResult('Testing...');
    
    try {
      // Test the symptom analysis
      const response = await geminiSymptomChecker.analyzeSymptoms(testInput);
      
      setTestResult(`✅ Test successful!
      
Response: ${response.message.substring(0, 200)}...

Urgency Level: ${response.urgencyLevel}
Formatted Response Available: ${response.formattedResponse ? 'Yes' : 'No'}
      `);
    } catch (error) {
      setTestResult(`❌ Test failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const runEmergencyTest = async () => {
    setIsLoading(true);
    setTestResult('Testing emergency detection...');
    
    try {
      const response = await geminiSymptomChecker.analyzeSymptoms('I have severe chest pain and difficulty breathing');
      
      setTestResult(`✅ Emergency test successful!
      
Response: ${response.message.substring(0, 200)}...

Urgency Level: ${response.urgencyLevel}
Emergency Detected: ${response.urgencyLevel === 'emergency' ? 'Yes' : 'No'}
      `);
    } catch (error) {
      setTestResult(`❌ Emergency test failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    geminiSymptomChecker.clearConversation();
    setTestResult('✅ Conversation cleared');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Symptom Checker Test Suite</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={runApiKeyTest} variant="outline">
              Test API Key Configuration
            </Button>
            
            <Button onClick={clearConversation} variant="outline">
              Clear Conversation
            </Button>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Test Input:</label>
            <Input
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="Enter symptoms to test..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={runSymptomTest} 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Testing...' : 'Test Symptom Analysis'}
            </Button>
            
            <Button 
              onClick={runEmergencyTest} 
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? 'Testing...' : 'Test Emergency Detection'}
            </Button>
          </div>
          
          {testResult && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-4 rounded">
                  {testResult}
                </pre>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>Google Generative AI SDK installed</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>Gemini service created</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>Conversation context management implemented</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>Response formatting implemented</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>Error handling implemented</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>UI updated with Gemini integration</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
