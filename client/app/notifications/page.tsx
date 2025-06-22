"use client"

import { motion } from "framer-motion"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Bell, 
  Clock, 
  Pill, 
  Calendar,
  Heart,
  AlertTriangle,
  CheckCircle,
  X,
  Settings
} from "lucide-react"

const notifications = [
  {
    id: 1,
    type: "medicine",
    title: "Medicine Reminder",
    message: "Time to take your Dolo 625 tablet",
    time: "2 minutes ago",
    read: false,
    priority: "high",
    icon: Pill
  },
  {
    id: 2,
    type: "appointment",
    title: "Upcoming Appointment",
    message: "Dr. Smith consultation scheduled for tomorrow at 10:00 AM",
    time: "1 hour ago",
    read: false,
    priority: "medium",
    icon: Calendar
  },
  {
    id: 3,
    type: "health",
    title: "Health Check Reminder",
    message: "It's been a week since your last health check-in",
    time: "3 hours ago",
    read: true,
    priority: "low",
    icon: Heart
  },
  {
    id: 4,
    type: "alert",
    title: "Disease Alert",
    message: "Dengue cases increasing in your area. Take precautions.",
    time: "5 hours ago",
    read: false,
    priority: "high",
    icon: AlertTriangle
  },
  {
    id: 5,
    type: "system",
    title: "Profile Updated",
    message: "Your health profile has been successfully updated",
    time: "1 day ago",
    read: true,
    priority: "low",
    icon: CheckCircle
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
}

export default function NotificationsPage() {
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <MainLayout>
      <motion.div 
        className="p-6 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button>
              Mark All Read
            </Button>
          </div>
        </motion.div>

        {/* Notification Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div variants={itemVariants}>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 font-medium">Total</p>
                    <p className="text-2xl font-bold text-blue-700">{notifications.length}</p>
                  </div>
                  <Bell className="h-6 w-6 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-600 font-medium">Unread</p>
                    <p className="text-2xl font-bold text-red-700">{unreadCount}</p>
                  </div>
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 font-medium">Medicine</p>
                    <p className="text-2xl font-bold text-green-700">
                      {notifications.filter(n => n.type === 'medicine').length}
                    </p>
                  </div>
                  <Pill className="h-6 w-6 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 font-medium">Health</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {notifications.filter(n => n.type === 'health').length}
                    </p>
                  </div>
                  <Heart className="h-6 w-6 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Notifications List */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${
                    !notification.read 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    notification.type === 'medicine' ? 'bg-green-100' :
                    notification.type === 'appointment' ? 'bg-blue-100' :
                    notification.type === 'health' ? 'bg-purple-100' :
                    notification.type === 'alert' ? 'bg-red-100' :
                    'bg-gray-100'
                  }`}>
                    <notification.icon className={`h-5 w-5 ${
                      notification.type === 'medicine' ? 'text-green-600' :
                      notification.type === 'appointment' ? 'text-blue-600' :
                      notification.type === 'health' ? 'text-purple-600' :
                      notification.type === 'alert' ? 'text-red-600' :
                      'text-gray-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                        <p className="text-gray-600 mt-1">{notification.message}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{notification.time}</span>
                          <Badge 
                            variant={
                              notification.priority === 'high' ? 'destructive' :
                              notification.priority === 'medium' ? 'default' :
                              'secondary'
                            }
                            className="text-xs"
                          >
                            {notification.priority}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </MainLayout>
  )
}
