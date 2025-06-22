"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MainLayout } from "@/components/layout/main-layout"
import { Mic, MicOff, Send, Bot, User, Languages, Play, Pause, AlertTriangle, Clock, CheckCircle, Settings } from "lucide-react"
import { geminiSymptomChecker } from "@/lib/gemini"
import { conversationManager, type Message } from "@/lib/conversation-context"
import { responseFormatter } from "@/lib/response-formatter"
import { speechRecognitionService, type SpeechRecognitionResult } from "@/lib/speech-recognition"
import { textToSpeechService } from "@/lib/text-to-speech"
import { VoiceSettings } from "@/components/voice-settings"

// Remove the local Message interface since we're importing it from conversation-context

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
  { code: "bn", name: "বাংলা" },
  { code: "te", name: "తెలుగు" },
  { code: "ta", name: "தமிழ்" },
  { code: "gu", name: "ગુજરાતી" },
]

export default function SymptomCheckerPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [isPlaying, setIsPlaying] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [voiceInputUsed, setVoiceInputUsed] = useState(false)
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(false)
  const [ttsSupported, setTtsSupported] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState("")
  const [showVoiceSettings, setShowVoiceSettings] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize conversation and voice services on component mount
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Initialize chat
        const greeting = geminiSymptomChecker.getInitialGreeting()
        const session = conversationManager.getCurrentSession()
        if (session) {
          setMessages(session.messages)
        }

        // Check voice service support
        setSpeechRecognitionSupported(speechRecognitionService.isRecognitionSupported())
        setTtsSupported(textToSpeechService.isTTSSupported())

        // Request microphone permission if supported
        if (speechRecognitionService.isRecognitionSupported()) {
          await speechRecognitionService.requestMicrophonePermission()
        }

        // Configure TTS for medical content
        if (textToSpeechService.isTTSSupported()) {
          const medicalVoices = textToSpeechService.getMedicalVoices()
          if (medicalVoices.length > 0) {
            textToSpeechService.setVoiceByName(medicalVoices[0].name)
          }
        }
      } catch (error) {
        console.error('Error initializing chat:', error)
      }
    }

    initializeChat()
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Update messages when conversation changes
  useEffect(() => {
    const session = conversationManager.getCurrentSession()
    if (session) {
      setMessages(session.messages)
      scrollToBottom()
    }
  }, [])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userInput = inputMessage.trim()
    const wasVoiceInput = voiceInputUsed
    setInputMessage("")
    setIsLoading(true)
    setVoiceInputUsed(false) // Reset voice input flag

    try {
      // Analyze symptoms with Gemini AI
      const response = await geminiSymptomChecker.analyzeSymptoms(userInput)

      // Update messages from conversation manager
      const session = conversationManager.getCurrentSession()
      if (session) {
        setMessages([...session.messages])

        // If user used voice input, automatically play the response
        if (wasVoiceInput && ttsSupported && session.messages.length > 0) {
          const lastBotMessage = session.messages
            .slice()
            .reverse()
            .find(msg => msg.type === 'bot')

          if (lastBotMessage) {
            setTimeout(() => {
              handlePlayAudio(lastBotMessage.id, lastBotMessage.content)
            }, 500) // Small delay to ensure UI is updated
          }
        }
      }

      scrollToBottom()
    } catch (error) {
      console.error('Error sending message:', error)
      // Error handling is done in the geminiSymptomChecker
    } finally {
      setIsLoading(false)
    }
  }

  // Remove getBotResponse since we're using Gemini AI now

  const handleVoiceInput = () => {
    if (!speechRecognitionSupported) {
      alert('Speech recognition is not supported in your browser. Please use a modern browser like Chrome, Edge, or Safari.')
      return
    }

    if (isRecording) {
      // Stop recording
      speechRecognitionService.stopListening()
      setIsRecording(false)
      setInterimTranscript("")
    } else {
      // Start recording
      setIsRecording(true)
      setInterimTranscript("")
      setVoiceInputUsed(true)

      speechRecognitionService.startListening(
        (result: SpeechRecognitionResult) => {
          if (result.isFinal) {
            // Final result - add to input
            setInputMessage(prev => prev + result.transcript)
            setInterimTranscript("")
            setIsRecording(false)
          } else {
            // Interim result - show as preview
            setInterimTranscript(result.transcript)
          }
        },
        (error: string) => {
          console.error('Speech recognition error:', error)
          setIsRecording(false)
          setInterimTranscript("")
          alert(`Voice input error: ${error}`)
        },
        () => {
          // Recognition ended
          setIsRecording(false)
          setInterimTranscript("")
        }
      )
    }
  }

  const handlePlayAudio = (messageId: string, messageContent: string) => {
    if (!ttsSupported) {
      alert('Text-to-speech is not supported in your browser.')
      return
    }

    if (isPlaying === messageId) {
      // Stop current playback
      textToSpeechService.stop()
      setIsPlaying(null)
    } else {
      // Stop any current playback first
      textToSpeechService.stop()
      setIsPlaying(messageId)

      // Start new playback
      textToSpeechService.speak(messageContent, {
        onStart: () => {
          setIsPlaying(messageId)
        },
        onEnd: () => {
          setIsPlaying(null)
        },
        onError: (error) => {
          console.error('TTS Error:', error)
          setIsPlaying(null)
          alert(`Audio playback error: ${error}`)
        }
      })
    }
  }

  const getUrgencyIcon = (urgencyLevel?: string) => {
    switch (urgencyLevel) {
      case 'emergency':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const getUrgencyColor = (urgencyLevel?: string) => {
    switch (urgencyLevel) {
      case 'emergency':
        return 'border-l-4 border-red-500 bg-red-50'
      case 'high':
        return 'border-l-4 border-orange-500 bg-orange-50'
      case 'medium':
        return 'border-l-4 border-yellow-500 bg-yellow-50'
      case 'low':
        return 'border-l-4 border-green-500 bg-green-50'
      default:
        return 'bg-white border'
    }
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">AI Symptom Checker</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Describe your symptoms and get preliminary health guidance. Available in multiple languages with voice
            support.
          </p>
        </div>

        {/* Language Selection */}
        <Card className="bg-white/80 backdrop-blur-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Languages className="h-5 w-5 mr-2 text-blue-600" />
              Select Language
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={selectedLanguage === lang.code ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={selectedLanguage === lang.code ? "bg-blue-600" : ""}
                >
                  {lang.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="bg-white/80 backdrop-blur-sm border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Bot className="h-5 w-5 mr-2 text-purple-600" />
                  Health Assistant Chat
                </CardTitle>
                <CardDescription>
                  Type or speak your symptoms. The AI will ask follow-up questions to better understand your condition.
                </CardDescription>
              </div>
              {(speechRecognitionSupported || ttsSupported) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVoiceSettings(true)}
                  className="flex items-center space-x-1"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Voice Settings</span>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Messages */}
            <div className="h-96 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback
                        className={
                          message.type === "user" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"
                        }
                      >
                        {message.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>

                    <div
                      className={`p-3 rounded-lg ${
                        message.type === "user"
                          ? "bg-blue-600 text-white"
                          : getUrgencyColor(message.urgencyLevel)
                      }`}
                    >
                      {/* Urgency indicator for bot messages */}
                      {message.type === "bot" && message.urgencyLevel && (
                        <div className="flex items-center space-x-2 mb-2">
                          {getUrgencyIcon(message.urgencyLevel)}
                          <span className="text-xs font-semibold uppercase tracking-wide">
                            {message.urgencyLevel} Priority
                          </span>
                        </div>
                      )}

                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>

                      {/* Show symptoms and medicines if available */}
                      {message.type === "bot" && (message.symptoms?.length || message.medicines?.length) && (
                        <div className="mt-3 pt-2 border-t border-gray-200">
                          {message.symptoms?.length && (
                            <div className="mb-2">
                              <span className="text-xs font-semibold text-gray-600">Symptoms identified:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {message.symptoms.map((symptom, index) => (
                                  <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {symptom}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {message.medicines?.length && (
                            <div>
                              <span className="text-xs font-semibold text-gray-600">Suggested medicines:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {message.medicines.map((medicine, index) => (
                                  <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    {medicine}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs ${message.type === "user" ? "text-blue-100" : "text-gray-500"}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {message.hasAudio && message.type === "bot" && ttsSupported && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className={`h-6 w-6 p-0 ${isPlaying === message.id ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
                            onClick={() => handlePlayAudio(message.id, message.content)}
                            title={isPlaying === message.id ? 'Stop audio' : 'Play audio'}
                          >
                            {isPlaying === message.id ? (
                              <Pause className="h-3 w-3 animate-pulse" />
                            ) : (
                              <Play className="h-3 w-3" />
                            )}
                          </Button>
                        )}

                        {message.type === "bot" && !ttsSupported && (
                          <div className="text-xs text-gray-400" title="Audio not supported in this browser">
                            🔇
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 max-w-xs lg:max-w-md">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="p-3 rounded-lg bg-white border">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-sm text-gray-500">Analyzing your symptoms...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={isRecording ? "Listening..." : "Describe your symptoms..."}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                    className="pr-12"
                    disabled={isLoading || isRecording}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`absolute right-1 top-1 h-8 w-8 p-0 ${
                      !speechRecognitionSupported ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={handleVoiceInput}
                    disabled={!speechRecognitionSupported || isLoading}
                    title={
                      !speechRecognitionSupported
                        ? 'Voice input not supported in this browser'
                        : isRecording
                        ? 'Stop recording'
                        : 'Start voice input'
                    }
                  >
                    {isRecording ? (
                      <MicOff className="h-4 w-4 text-red-500 animate-pulse" />
                    ) : (
                      <Mic className={`h-4 w-4 ${speechRecognitionSupported ? 'text-gray-500 hover:text-blue-500' : 'text-gray-300'}`} />
                    )}
                  </Button>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading || isRecording}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Voice input feedback */}
              {isRecording && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-red-600 mb-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Recording... Speak clearly</span>
                  </div>
                  {interimTranscript && (
                    <div className="text-sm text-gray-600 italic">
                      "{interimTranscript}"
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    Click the microphone again or stop speaking to finish
                  </div>
                </div>
              )}

              {/* Voice service status */}
              {(!speechRecognitionSupported || !ttsSupported) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                  <div className="text-xs text-yellow-700">
                    {!speechRecognitionSupported && !ttsSupported && (
                      "Voice features not supported in this browser. Please use Chrome, Edge, or Safari for voice input and audio responses."
                    )}
                    {!speechRecognitionSupported && ttsSupported && (
                      "Voice input not supported. Audio responses are available."
                    )}
                    {speechRecognitionSupported && !ttsSupported && (
                      "Audio responses not supported. Voice input is available."
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1">Important Disclaimer</h4>
                <p className="text-sm text-yellow-700">
                  This AI symptom checker is for informational purposes only and should not replace professional medical
                  advice. Always consult with a qualified healthcare provider for proper diagnosis and treatment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voice Settings Modal */}
        <VoiceSettings
          isOpen={showVoiceSettings}
          onClose={() => setShowVoiceSettings(false)}
        />
      </div>
    </MainLayout>
  )
}
