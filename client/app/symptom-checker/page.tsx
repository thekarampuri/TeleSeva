"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MainLayout } from "@/components/layout/main-layout"
import { Mic, MicOff, Send, Bot, User, Languages, Play, Pause, AlertTriangle, Clock, CheckCircle } from "lucide-react"
import { geminiSymptomChecker } from "@/lib/gemini"
import { conversationManager, type Message } from "@/lib/conversation-context"
import { responseFormatter } from "@/lib/response-formatter"

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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize conversation on component mount
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const greeting = geminiSymptomChecker.getInitialGreeting()
        const session = conversationManager.getCurrentSession()
        if (session) {
          setMessages(session.messages)
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
    setInputMessage("")
    setIsLoading(true)

    try {
      // Analyze symptoms with Gemini AI
      const response = await geminiSymptomChecker.analyzeSymptoms(userInput)

      // Update messages from conversation manager
      const session = conversationManager.getCurrentSession()
      if (session) {
        setMessages([...session.messages])
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
    setIsRecording(!isRecording)
    // Voice recording logic would go here
  }

  const handlePlayAudio = (messageId: string) => {
    setIsPlaying(isPlaying === messageId ? null : messageId)
    // Text-to-speech logic would go here
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
            <CardTitle className="flex items-center">
              <Bot className="h-5 w-5 mr-2 text-purple-600" />
              Health Assistant Chat
            </CardTitle>
            <CardDescription>
              Type or speak your symptoms. The AI will ask follow-up questions to better understand your condition.
            </CardDescription>
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
                        {message.hasAudio && message.type === "bot" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => handlePlayAudio(message.id)}
                          >
                            {isPlaying === message.id ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                          </Button>
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
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Describe your symptoms..."
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  className="pr-12"
                  disabled={isLoading}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={handleVoiceInput}
                >
                  {isRecording ? (
                    <MicOff className="h-4 w-4 text-red-500" />
                  ) : (
                    <Mic className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {isRecording && (
              <div className="mt-2 flex items-center justify-center space-x-2 text-red-500">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm">Recording... Speak now</span>
              </div>
            )}
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
      </div>
    </MainLayout>
  )
}
