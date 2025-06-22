"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MainLayout } from "@/components/layout/main-layout"
import { Mic, MicOff, Send, Bot, User, Languages, Play, Pause } from "lucide-react"

interface Message {
  id: number
  type: "user" | "bot"
  content: string
  timestamp: Date
  hasAudio?: boolean
}

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
  { code: "bn", name: "বাংলা" },
  { code: "te", name: "తెలుగు" },
  { code: "ta", name: "தமிழ்" },
  { code: "gu", name: "ગુજરાતી" },
]

export default function SymptomCheckerPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      content:
        "Hello! I'm your AI health assistant. I can help you understand your symptoms. You can type or speak to me in your preferred language. How are you feeling today?",
      timestamp: new Date(),
      hasAudio: true,
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [isPlaying, setIsPlaying] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        type: "bot",
        content: getBotResponse(inputMessage),
        timestamp: new Date(),
        hasAudio: true,
      }
      setMessages((prev) => [...prev, botResponse])
      scrollToBottom()
    }, 1000)
  }

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("fever") || input.includes("temperature")) {
      return "I understand you have a fever. Can you tell me your temperature and how long you've had it? Also, do you have any other symptoms like headache, body ache, or chills?"
    } else if (input.includes("headache") || input.includes("head pain")) {
      return "Headaches can have various causes. On a scale of 1-10, how severe is your headache? Is it throbbing, sharp, or dull? Do you have any nausea or sensitivity to light?"
    } else if (input.includes("cough")) {
      return "I see you have a cough. Is it a dry cough or are you bringing up phlegm? How long have you had this cough? Do you have any chest pain or shortness of breath?"
    } else {
      return "Thank you for sharing that information. To better understand your condition, can you describe your symptoms in more detail? When did they start and how severe are they?"
    }
  }

  const handleVoiceInput = () => {
    setIsRecording(!isRecording)
    // Voice recording logic would go here
  }

  const handlePlayAudio = (messageId: number) => {
    setIsPlaying(isPlaying === messageId ? null : messageId)
    // Text-to-speech logic would go here
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
                      className={`p-3 rounded-lg ${message.type === "user" ? "bg-blue-600 text-white" : "bg-white border"}`}
                    >
                      <p className="text-sm">{message.content}</p>
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
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Describe your symptoms..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="pr-12"
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
              <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
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
