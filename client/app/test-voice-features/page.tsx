"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { speechRecognitionService } from '@/lib/speech-recognition'
import { textToSpeechService } from '@/lib/text-to-speech'
import { Mic, MicOff, Play, Pause, Volume2, VolumeX, CheckCircle, XCircle } from 'lucide-react'

export default function TestVoiceFeaturesPage() {
  const [speechSupported, setSpeechSupported] = useState(false)
  const [ttsSupported, setTtsSupported] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [testText, setTestText] = useState('Hello! This is a test of the text-to-speech feature. I am your AI health assistant.')
  const [testResults, setTestResults] = useState<string[]>([])

  useEffect(() => {
    // Check support
    setSpeechSupported(speechRecognitionService.isRecognitionSupported())
    setTtsSupported(textToSpeechService.isTTSSupported())
    
    addTestResult(`Speech Recognition Supported: ${speechRecognitionService.isRecognitionSupported()}`)
    addTestResult(`Text-to-Speech Supported: ${textToSpeechService.isTTSSupported()}`)
  }, [])

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`])
  }

  const testSpeechRecognition = () => {
    if (!speechSupported) {
      addTestResult('❌ Speech recognition not supported')
      return
    }

    if (isRecording) {
      speechRecognitionService.stopListening()
      setIsRecording(false)
      addTestResult('🛑 Stopped recording')
    } else {
      setIsRecording(true)
      setTranscript('')
      addTestResult('🎤 Started recording...')

      speechRecognitionService.startListening(
        (result) => {
          if (result.isFinal) {
            setTranscript(result.transcript)
            setIsRecording(false)
            addTestResult(`✅ Final transcript: "${result.transcript}" (confidence: ${result.confidence.toFixed(2)})`)
          } else {
            setTranscript(result.transcript)
            addTestResult(`⏳ Interim: "${result.transcript}"`)
          }
        },
        (error) => {
          setIsRecording(false)
          addTestResult(`❌ Speech recognition error: ${error}`)
        },
        () => {
          setIsRecording(false)
          addTestResult('🏁 Speech recognition ended')
        }
      )
    }
  }

  const testTextToSpeech = () => {
    if (!ttsSupported) {
      addTestResult('❌ Text-to-speech not supported')
      return
    }

    if (isPlaying) {
      textToSpeechService.stop()
      setIsPlaying(false)
      addTestResult('🛑 Stopped TTS')
    } else {
      setIsPlaying(true)
      addTestResult('🔊 Starting TTS...')

      textToSpeechService.speak(testText, {
        onStart: () => {
          setIsPlaying(true)
          addTestResult('▶️ TTS started')
        },
        onEnd: () => {
          setIsPlaying(false)
          addTestResult('✅ TTS completed')
        },
        onError: (error) => {
          setIsPlaying(false)
          addTestResult(`❌ TTS error: ${error}`)
        }
      })
    }
  }

  const testMicrophonePermission = async () => {
    addTestResult('🔍 Checking microphone permission...')
    
    const permission = await speechRecognitionService.checkMicrophonePermission()
    addTestResult(`📋 Current permission: ${permission}`)
    
    if (permission !== 'granted') {
      addTestResult('🔑 Requesting microphone permission...')
      const granted = await speechRecognitionService.requestMicrophonePermission()
      addTestResult(`${granted ? '✅' : '❌'} Permission ${granted ? 'granted' : 'denied'}`)
    }
  }

  const testVoiceList = () => {
    const voices = textToSpeechService.getAvailableVoices()
    addTestResult(`🎭 Available voices: ${voices.length}`)
    
    const medicalVoices = textToSpeechService.getMedicalVoices()
    addTestResult(`🏥 Medical voices: ${medicalVoices.length}`)
    
    voices.slice(0, 5).forEach((voice, index) => {
      addTestResult(`  ${index + 1}. ${voice.name} (${voice.lang}) ${voice.gender ? `- ${voice.gender}` : ''}`)
    })
  }

  const clearResults = () => {
    setTestResults([])
  }

  const runFullTest = async () => {
    clearResults()
    addTestResult('🚀 Starting comprehensive voice test...')
    
    // Test 1: Check support
    addTestResult(`Speech Recognition: ${speechSupported ? '✅' : '❌'}`)
    addTestResult(`Text-to-Speech: ${ttsSupported ? '✅' : '❌'}`)
    
    // Test 2: Check permissions
    await testMicrophonePermission()
    
    // Test 3: List voices
    testVoiceList()
    
    // Test 4: Test TTS
    if (ttsSupported) {
      addTestResult('🔊 Testing TTS with short phrase...')
      textToSpeechService.speak('Voice test successful', {
        onEnd: () => addTestResult('✅ TTS test completed')
      })
    }
    
    addTestResult('🏁 Comprehensive test completed')
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Voice Features Test Suite</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Support Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className={speechSupported ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  {speechSupported ? <CheckCircle className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
                  <span className="font-medium">Speech Recognition</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {speechSupported ? 'Supported and ready' : 'Not supported in this browser'}
                </p>
              </CardContent>
            </Card>

            <Card className={ttsSupported ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  {ttsSupported ? <CheckCircle className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
                  <span className="font-medium">Text-to-Speech</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {ttsSupported ? 'Supported and ready' : 'Not supported in this browser'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Test Controls */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Individual Tests</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                onClick={testSpeechRecognition}
                disabled={!speechSupported}
                variant={isRecording ? "destructive" : "default"}
                className="flex items-center space-x-2"
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                <span>{isRecording ? 'Stop Recording' : 'Test Speech'}</span>
              </Button>

              <Button 
                onClick={testTextToSpeech}
                disabled={!ttsSupported}
                variant={isPlaying ? "destructive" : "default"}
                className="flex items-center space-x-2"
              >
                {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                <span>{isPlaying ? 'Stop TTS' : 'Test TTS'}</span>
              </Button>

              <Button onClick={testMicrophonePermission} variant="outline">
                Check Permissions
              </Button>

              <Button onClick={testVoiceList} variant="outline">
                List Voices
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">TTS Test Text:</label>
              <Input
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                placeholder="Enter text to test TTS..."
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={runFullTest} className="bg-blue-600 hover:bg-blue-700">
                Run Full Test Suite
              </Button>
              <Button onClick={clearResults} variant="outline">
                Clear Results
              </Button>
            </div>
          </div>

          {/* Current Transcript */}
          {transcript && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-blue-800 mb-2">Current Transcript:</h4>
                <p className="text-blue-700">"{transcript}"</p>
              </CardContent>
            </Card>
          )}

          {/* Test Results */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
                {testResults.length === 0 ? (
                  <p className="text-gray-500 italic">No test results yet. Run some tests to see results here.</p>
                ) : (
                  <div className="space-y-1">
                    {testResults.map((result, index) => (
                      <div key={index} className="text-sm font-mono">
                        {result}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Usage Instructions */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Usage Instructions:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• <strong>Speech Recognition:</strong> Click "Test Speech" and speak clearly into your microphone</li>
                <li>• <strong>Text-to-Speech:</strong> Modify the test text and click "Test TTS" to hear it spoken</li>
                <li>• <strong>Permissions:</strong> Grant microphone access when prompted for speech recognition</li>
                <li>• <strong>Browser Support:</strong> Works best in Chrome, Edge, and Safari</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
