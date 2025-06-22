"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MainLayout } from "@/components/layout/main-layout"
import { Trophy, Star, Target, Gift, Zap, Heart, Activity, Calendar, Award, Flame, CheckCircle } from "lucide-react"

const userStats = {
  totalPoints: 2450,
  level: 8,
  streak: 12,
  completedActivities: 45,
  nextLevelPoints: 2800,
}

const achievements = [
  {
    id: 1,
    title: "Health Warrior",
    description: "Complete 30 health activities",
    icon: Trophy,
    progress: 45,
    target: 30,
    completed: true,
    points: 500,
    rarity: "gold",
  },
  {
    id: 2,
    title: "Streak Master",
    description: "Maintain a 14-day streak",
    icon: Flame,
    progress: 12,
    target: 14,
    completed: false,
    points: 300,
    rarity: "silver",
  },
  {
    id: 3,
    title: "Knowledge Seeker",
    description: "Watch 20 educational videos",
    icon: Star,
    progress: 15,
    target: 20,
    completed: false,
    points: 200,
    rarity: "bronze",
  },
]

const dailyTasks = [
  {
    id: 1,
    title: "Drink 8 glasses of water",
    points: 50,
    completed: true,
    icon: Heart,
  },
  {
    id: 2,
    title: "Take medication on time",
    points: 100,
    completed: true,
    icon: CheckCircle,
  },
  {
    id: 3,
    title: "Complete symptom check",
    points: 75,
    completed: false,
    icon: Activity,
  },
  {
    id: 4,
    title: "Read health article",
    points: 60,
    completed: false,
    icon: Star,
  },
]

const rewards = [
  {
    id: 1,
    title: "Free Consultation",
    description: "Get a free 15-minute consultation with any doctor",
    points: 1000,
    available: true,
    icon: Gift,
    category: "Healthcare",
  },
  {
    id: 2,
    title: "20% Medicine Discount",
    description: "Get 20% off on your next medicine order",
    points: 500,
    available: true,
    icon: Gift,
    category: "Medicine",
  },
  {
    id: 3,
    title: "Premium Health Tips",
    description: "Access premium health content for 1 month",
    points: 750,
    available: false,
    icon: Gift,
    category: "Content",
  },
]

const leaderboard = [
  { rank: 1, name: "Priya S.", points: 3250, avatar: "PS" },
  { rank: 2, name: "Rajesh K.", points: 2890, avatar: "RK" },
  { rank: 3, name: "You", points: 2450, avatar: "YU", isUser: true },
  { rank: 4, name: "Anita P.", points: 2340, avatar: "AP" },
  { rank: 5, name: "Suresh M.", points: 2180, avatar: "SM" },
]

export default function GamificationPage() {
  const [selectedTab, setSelectedTab] = useState("dashboard")

  const progressToNextLevel = ((userStats.totalPoints % 350) / 350) * 100

  return (
    <MainLayout>
      <div className="p-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Health Rewards</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay motivated on your health journey. Complete activities, earn points, and unlock rewards!
          </p>
        </div>

        {/* User Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 mx-auto mb-2" />
              <p className="text-purple-100">Total Points</p>
              <p className="text-3xl font-bold">{userStats.totalPoints.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 mx-auto mb-2" />
              <p className="text-blue-100">Level</p>
              <p className="text-3xl font-bold">{userStats.level}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6 text-center">
              <Flame className="h-8 w-8 mx-auto mb-2" />
              <p className="text-orange-100">Streak</p>
              <p className="text-3xl font-bold">{userStats.streak} days</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 mx-auto mb-2" />
              <p className="text-green-100">Activities</p>
              <p className="text-3xl font-bold">{userStats.completedActivities}</p>
            </CardContent>
          </Card>
        </div>

        {/* Level Progress */}
        <Card className="bg-white/80 backdrop-blur-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-500" />
              Level Progress
            </CardTitle>
            <CardDescription>
              {userStats.nextLevelPoints - userStats.totalPoints} points to reach Level {userStats.level + 1}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Level {userStats.level}</span>
                <span>Level {userStats.level + 1}</span>
              </div>
              <Progress value={progressToNextLevel} className="h-3" />
              <p className="text-sm text-gray-500 text-center">
                {userStats.totalPoints} / {userStats.nextLevelPoints} points
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Daily Tasks */}
        <Card className="bg-white/80 backdrop-blur-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Daily Tasks
            </CardTitle>
            <CardDescription>Complete daily tasks to earn points and maintain your streak</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dailyTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    task.completed ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${task.completed ? "bg-green-100" : "bg-gray-100"}`}>
                      <task.icon className={`h-5 w-5 ${task.completed ? "text-green-600" : "text-gray-600"}`} />
                    </div>
                    <div>
                      <h4 className={`font-medium ${task.completed ? "text-green-900" : "text-gray-900"}`}>
                        {task.title}
                      </h4>
                      <p className={`text-sm ${task.completed ? "text-green-600" : "text-gray-500"}`}>
                        +{task.points} points
                      </p>
                    </div>
                  </div>
                  {task.completed ? (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  ) : (
                    <Button size="sm">Complete</Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="bg-white/80 backdrop-blur-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
              Achievements
            </CardTitle>
            <CardDescription>Unlock achievements by completing health activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-6 rounded-lg border-2 ${
                    achievement.completed ? "border-yellow-300 bg-yellow-50" : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="text-center space-y-4">
                    <div
                      className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                        achievement.rarity === "gold"
                          ? "bg-yellow-100"
                          : achievement.rarity === "silver"
                            ? "bg-gray-100"
                            : "bg-orange-100"
                      }`}
                    >
                      <achievement.icon
                        className={`h-8 w-8 ${
                          achievement.rarity === "gold"
                            ? "text-yellow-600"
                            : achievement.rarity === "silver"
                              ? "text-gray-600"
                              : "text-orange-600"
                        }`}
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                    </div>

                    <div className="space-y-2">
                      <Progress value={(achievement.progress / achievement.target) * 100} className="h-2" />
                      <p className="text-xs text-gray-500">
                        {achievement.progress} / {achievement.target}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge
                        className={`${
                          achievement.rarity === "gold"
                            ? "bg-yellow-100 text-yellow-800"
                            : achievement.rarity === "silver"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {achievement.points} pts
                      </Badge>
                      {achievement.completed && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Unlocked
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rewards Store */}
        <Card className="bg-white/80 backdrop-blur-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gift className="h-5 w-5 mr-2 text-purple-600" />
              Rewards Store
            </CardTitle>
            <CardDescription>Redeem your points for exclusive health benefits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className={`p-6 rounded-lg border ${
                    reward.available ? "border-purple-200 bg-purple-50" : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="text-center space-y-4">
                    <div
                      className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
                        reward.available ? "bg-purple-100" : "bg-gray-100"
                      }`}
                    >
                      <reward.icon className={`h-6 w-6 ${reward.available ? "text-purple-600" : "text-gray-400"}`} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">{reward.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{reward.description}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{reward.category}</Badge>
                      <span className="font-bold text-purple-600">{reward.points} pts</span>
                    </div>

                    <Button
                      className="w-full"
                      disabled={!reward.available || userStats.totalPoints < reward.points}
                      variant={reward.available ? "default" : "secondary"}
                    >
                      {reward.available ? "Redeem" : "Not Available"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="bg-white/80 backdrop-blur-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-gold-600" />
              Weekly Leaderboard
            </CardTitle>
            <CardDescription>See how you rank among other health enthusiasts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboard.map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    user.isUser ? "bg-blue-50 border border-blue-200" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        user.rank === 1
                          ? "bg-yellow-100 text-yellow-800"
                          : user.rank === 2
                            ? "bg-gray-100 text-gray-800"
                            : user.rank === 3
                              ? "bg-orange-100 text-orange-800"
                              : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.rank}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {user.avatar}
                    </div>
                    <div>
                      <p className={`font-medium ${user.isUser ? "text-blue-900" : "text-gray-900"}`}>{user.name}</p>
                      {user.isUser && <Badge className="bg-blue-100 text-blue-800 text-xs">You</Badge>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{user.points.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">points</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
