"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { textToSpeechService, type TTSVoice } from '@/lib/text-to-speech'
import { speechRecognitionService } from '@/lib/speech-recognition'
import { Volume2, Mic, Play, Settings } from 'lucide-react'

interface VoiceSettingsProps {
  isOpen: boolean
  onClose: () => void
}

export function VoiceSettings({ isOpen, onClose }: VoiceSettingsProps) {
  const [voices, setVoices] = useState<TTSVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>('')
  const [speechRate, setSpeechRate] = useState<number[]>([1.0])
  const [speechPitch, setSpeechPitch] = useState<number[]>([1.0])
  const [speechVolume, setSpeechVolume] = useState<number[]>([1.0])
  const [speechLanguage, setSpeechLanguage] = useState<string>('en-US')
  const [recognitionLanguage, setRecognitionLanguage] = useState<string>('en-US')

  useEffect(() => {
    if (isOpen) {
      loadVoiceSettings()
    }
  }, [isOpen])

  const loadVoiceSettings = () => {
    // Load available voices
    const availableVoices = textToSpeechService.getAvailableVoices()
    setVoices(availableVoices)

    // Load current configuration
    const config = textToSpeechService.getConfig()
    setSelectedVoice(config.voice?.name || '')
    setSpeechRate([config.rate])
    setSpeechPitch([config.pitch])
    setSpeechVolume([config.volume])
    setSpeechLanguage(config.language)

    // Load recognition language
    setRecognitionLanguage('en-US') // Default, could be stored in localStorage
  }

  const handleVoiceChange = (voiceName: string) => {
    setSelectedVoice(voiceName)
    textToSpeechService.setVoiceByName(voiceName)
  }

  const handleRateChange = (value: number[]) => {
    setSpeechRate(value)
    textToSpeechService.updateConfig({ rate: value[0] })
  }

  const handlePitchChange = (value: number[]) => {
    setSpeechPitch(value)
    textToSpeechService.updateConfig({ pitch: value[0] })
  }

  const handleVolumeChange = (value: number[]) => {
    setSpeechVolume(value)
    textToSpeechService.updateConfig({ volume: value[0] })
  }

  const handleSpeechLanguageChange = (language: string) => {
    setSpeechLanguage(language)
    textToSpeechService.updateConfig({ language })
    textToSpeechService.setVoiceByLanguage(language)
  }

  const handleRecognitionLanguageChange = (language: string) => {
    setRecognitionLanguage(language)
    speechRecognitionService.updateConfig({ language })
  }

  const testVoice = () => {
    const testText = "Hello! This is a test of the voice settings. I'm your AI health assistant, and I'm here to help you with your symptoms."
    textToSpeechService.speak(testText)
  }

  const resetToDefaults = () => {
    setSpeechRate([1.0])
    setSpeechPitch([1.0])
    setSpeechVolume([1.0])
    setSpeechLanguage('en-US')
    setRecognitionLanguage('en-US')
    
    textToSpeechService.updateConfig({
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      language: 'en-US'
    })
    
    speechRecognitionService.updateConfig({
      language: 'en-US'
    })

    // Set default voice
    const medicalVoices = textToSpeechService.getMedicalVoices()
    if (medicalVoices.length > 0) {
      setSelectedVoice(medicalVoices[0].name)
      textToSpeechService.setVoiceByName(medicalVoices[0].name)
    }
  }

  const supportedLanguages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'en-AU', name: 'English (Australia)' },
    { code: 'es-ES', name: 'Spanish (Spain)' },
    { code: 'es-MX', name: 'Spanish (Mexico)' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'it-IT', name: 'Italian' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)' },
    { code: 'hi-IN', name: 'Hindi' },
    { code: 'zh-CN', name: 'Chinese (Mandarin)' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'ko-KR', name: 'Korean' },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Voice Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Text-to-Speech Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Volume2 className="h-4 w-4" />
              <span>Audio Response Settings</span>
            </h3>

            <div className="space-y-3">
              <div>
                <Label htmlFor="voice-select">Voice</Label>
                <Select value={selectedVoice} onValueChange={handleVoiceChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {voices.map((voice) => (
                      <SelectItem key={voice.voiceURI} value={voice.name}>
                        {voice.name} ({voice.lang}) {voice.gender && `- ${voice.gender}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="speech-language">Language</Label>
                <Select value={speechLanguage} onValueChange={handleSpeechLanguageChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedLanguages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="speech-rate">Speech Rate: {speechRate[0].toFixed(1)}x</Label>
                <Slider
                  value={speechRate}
                  onValueChange={handleRateChange}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="speech-pitch">Pitch: {speechPitch[0].toFixed(1)}</Label>
                <Slider
                  value={speechPitch}
                  onValueChange={handlePitchChange}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="speech-volume">Volume: {Math.round(speechVolume[0] * 100)}%</Label>
                <Slider
                  value={speechVolume}
                  onValueChange={handleVolumeChange}
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  className="mt-2"
                />
              </div>

              <Button onClick={testVoice} variant="outline" className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Test Voice
              </Button>
            </div>
          </div>

          {/* Speech Recognition Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Mic className="h-4 w-4" />
              <span>Voice Input Settings</span>
            </h3>

            <div>
              <Label htmlFor="recognition-language">Recognition Language</Label>
              <Select value={recognitionLanguage} onValueChange={handleRecognitionLanguageChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supportedLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4 border-t">
            <Button onClick={resetToDefaults} variant="outline" className="flex-1">
              Reset to Defaults
            </Button>
            <Button onClick={onClose} className="flex-1">
              Done
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
