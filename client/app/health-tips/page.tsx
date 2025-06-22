"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainLayout } from "@/components/layout/main-layout"
import { Play, BookOpen, Search, Filter, Download, Languages, Clock, Eye, Shield, Zap } from "lucide-react"

const healthVideos = [
  {
    id: 1,
    title: "Understanding Diabetes: Prevention and Management",
    duration: "12:45",
    views: "2.3K",
    category: "Diabetes",
    language: "Hindi",
    thumbnail: "/placeholder.svg?height=200&width=300",
    offline: true,
  },
  {
    id: 2,
    title: "Heart Health: Simple Exercises for Better Circulation",
    duration: "8:30",
    views: "1.8K",
    category: "Heart Health",
    language: "English",
    thumbnail: "/placeholder.svg?height=200&width=300",
    offline: false,
  },
  {
    id: 3,
    title: "Mental Health: Managing Stress and Anxiety",
    duration: "15:20",
    views: "3.1K",
    category: "Mental Health",
    language: "Bengali",
    thumbnail: "/placeholder.svg?height=200&width=300",
    offline: true,
  },
]

const mythBustingCards = [
  {
    id: 1,
    myth: "Drinking cold water after meals causes cancer",
    fact: "There is no scientific evidence linking cold water consumption to cancer. Temperature of water does not affect digestion significantly.",
    category: "Nutrition",
    verified: true,
  },
  {
    id: 2,
    myth: "Cracking knuckles causes arthritis",
    fact: "Studies show no link between knuckle cracking and arthritis. The sound comes from gas bubbles in joint fluid.",
    category: "Bone Health",
    verified: true,
  },
  {
    id: 3,
    myth: "You need to drink 8 glasses of water daily",
    fact: "Water needs vary by person, activity level, and climate. Listen to your body and drink when thirsty.",
    category: "Hydration",
    verified: true,
  },
]

const articles = [
  {
    id: 1,
    title: "The Complete Guide to Seasonal Flu Prevention",
    excerpt:
      "Learn about vaccination, hygiene practices, and natural immunity boosters to protect yourself during flu season.",
    readTime: "5 min read",
    category: "Prevention",
    language: "English",
    offline: true,
  },
  {
    id: 2,
    title: "योग और मानसिक स्वास्थ्य: एक संपूर्ण गाइड",
    excerpt: "जानें कि कैसे योग आपके मानसिक स्वास्थ्य को बेहतर बना सकता है और तनाव को कम कर सकता है।",
    readTime: "7 min read",
    category: "Mental Health",
    language: "Hindi",
    offline: false,
  },
  {
    id: 3,
    title: "Nutrition During Pregnancy: Essential Guidelines",
    excerpt: "Comprehensive nutrition advice for expecting mothers, including essential vitamins and foods to avoid.",
    readTime: "10 min read",
    category: "Pregnancy",
    language: "English",
    offline: true,
  },
]

const languages = ["All", "English", "Hindi", "Bengali", "Tamil", "Telugu"]
const categories = ["All", "Heart Health", "Diabetes", "Mental Health", "Nutrition", "Prevention"]

export default function HealthTipsPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <MainLayout>
      <div className="p-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Health Tips & Education</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Access educational videos, myth-busting content, and health articles in your preferred language.
          </p>
        </div>

        {/* Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border-0">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search health topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Languages className="h-4 w-4 text-gray-500" />
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="border rounded-md px-3 py-2 text-sm"
                  >
                    {languages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border rounded-md px-3 py-2 text-sm"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="videos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="videos">Educational Videos</TabsTrigger>
            <TabsTrigger value="myths">Myth Busting</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {healthVideos.map((video) => (
                <Card
                  key={video.id}
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur-sm overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <div className="bg-white/90 rounded-full p-3 group-hover:scale-110 transition-transform">
                        <Play className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <Badge className="bg-blue-600 text-white">{video.language}</Badge>
                      {video.offline && (
                        <Badge className="bg-green-600 text-white">
                          <Download className="h-3 w-3 mr-1" />
                          Offline
                        </Badge>
                      )}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {video.views}
                        </div>
                        <Badge variant="outline">{video.category}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="myths" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mythBustingCards.map((item) => (
                <Card key={item.id} className="border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg text-red-600 flex items-start">
                        <Shield className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                        Myth
                      </CardTitle>
                      {item.verified && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded">
                      <p className="text-red-800 font-medium">{item.myth}</p>
                    </div>

                    <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
                      <div className="flex items-start">
                        <Zap className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-green-800 mb-1">Fact</h4>
                          <p className="text-green-700">{item.fact}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{item.category}</Badge>
                      <Button size="sm" variant="outline">
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="articles" className="space-y-6">
            <div className="space-y-4">
              {articles.map((article) => (
                <Card
                  key={article.id}
                  className="border-0 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{article.title}</h3>
                          {article.offline && (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              <Download className="h-3 w-3 mr-1" />
                              Offline
                            </Badge>
                          )}
                        </div>

                        <p className="text-gray-600 mb-4">{article.excerpt}</p>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {article.readTime}
                          </div>
                          <Badge variant="outline">{article.category}</Badge>
                          <Badge variant="outline">{article.language}</Badge>
                        </div>
                      </div>

                      <div className="ml-6">
                        <Button>
                          <BookOpen className="h-4 w-4 mr-2" />
                          Read Article
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Offline Mode Banner */}
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Offline Mode Available</h3>
                <p className="text-green-100">
                  Download content to access health tips even without internet connection
                </p>
              </div>
              <Button size="lg" className="bg-white text-green-600 hover:bg-green-50">
                <Download className="h-5 w-5 mr-2" />
                Download for Offline
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
