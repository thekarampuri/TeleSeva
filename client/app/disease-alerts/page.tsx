"use client"

import { motion } from "framer-motion"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  Users, 
  TrendingUp,
  Shield,
  Bell,
  ExternalLink
} from "lucide-react"

const alerts = [
  {
    id: 1,
    disease: "Dengue Fever",
    severity: "High",
    location: "Mumbai, Maharashtra",
    cases: 245,
    trend: "increasing",
    lastUpdated: "2 hours ago",
    description: "Significant increase in dengue cases reported in the last week.",
    prevention: ["Use mosquito repellent", "Remove stagnant water", "Wear long sleeves"]
  },
  {
    id: 2,
    disease: "Seasonal Flu",
    severity: "Medium",
    location: "Delhi NCR",
    cases: 89,
    trend: "stable",
    lastUpdated: "4 hours ago",
    description: "Seasonal flu cases remain stable with normal vaccination rates.",
    prevention: ["Get flu vaccination", "Wash hands frequently", "Avoid crowded places"]
  },
  {
    id: 3,
    disease: "Food Poisoning",
    severity: "Low",
    location: "Bangalore, Karnataka",
    cases: 23,
    trend: "decreasing",
    lastUpdated: "6 hours ago",
    description: "Food poisoning cases decreasing after restaurant inspections.",
    prevention: ["Eat from trusted sources", "Check food hygiene", "Drink clean water"]
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

export default function DiseaseAlertsPage() {
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
            <h1 className="text-3xl font-bold text-gray-900">Disease Alerts</h1>
            <p className="text-gray-600 mt-1">Stay informed about health risks in your area</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Bell className="h-4 w-4 mr-2" />
            Enable Notifications
          </Button>
        </motion.div>

        {/* Alert Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={itemVariants}>
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-600 font-medium">High Risk Alerts</p>
                    <p className="text-2xl font-bold text-red-700">1</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 font-medium">Medium Risk</p>
                    <p className="text-2xl font-bold text-yellow-700">1</p>
                  </div>
                  <Shield className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 font-medium">Low Risk</p>
                    <p className="text-2xl font-bold text-green-700">1</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Active Alerts */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Active Disease Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{alert.disease}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          {alert.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-1" />
                          {alert.cases} cases
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          {alert.lastUpdated}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={alert.severity === 'High' ? 'destructive' : 
                                alert.severity === 'Medium' ? 'default' : 'secondary'}
                      >
                        {alert.severity} Risk
                      </Badge>
                      <Badge 
                        variant="outline"
                        className={
                          alert.trend === 'increasing' ? 'border-red-300 text-red-600' :
                          alert.trend === 'stable' ? 'border-yellow-300 text-yellow-600' :
                          'border-green-300 text-green-600'
                        }
                      >
                        {alert.trend}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{alert.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Prevention Tips:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {alert.prevention.map((tip, tipIndex) => (
                        <li key={tipIndex}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
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
