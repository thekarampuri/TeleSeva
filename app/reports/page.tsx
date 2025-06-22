"use client"

import { motion } from "framer-motion"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Download, 
  Calendar, 
  Activity,
  Heart,
  Pill,
  TrendingUp,
  Eye,
  Share,
  Filter
} from "lucide-react"

const reports = [
  {
    id: 1,
    title: "Monthly Health Summary",
    type: "Health Report",
    date: "December 2024",
    status: "Ready",
    description: "Comprehensive overview of your health metrics for the past month",
    size: "2.4 MB",
    pages: 12,
    icon: Activity
  },
  {
    id: 2,
    title: "Heart Rate Analysis",
    type: "Vital Signs",
    date: "Last 30 days",
    status: "Ready",
    description: "Detailed analysis of your heart rate patterns and trends",
    size: "1.8 MB",
    pages: 8,
    icon: Heart
  },
  {
    id: 3,
    title: "Medication Adherence Report",
    type: "Medicine Report",
    date: "November 2024",
    status: "Ready",
    description: "Track your medication compliance and schedule adherence",
    size: "1.2 MB",
    pages: 6,
    icon: Pill
  },
  {
    id: 4,
    title: "Consultation History",
    type: "Medical Records",
    date: "Last 6 months",
    status: "Processing",
    description: "Complete record of all your medical consultations and prescriptions",
    size: "3.1 MB",
    pages: 18,
    icon: FileText
  },
  {
    id: 5,
    title: "Wellness Trends",
    type: "Analytics",
    date: "Year 2024",
    status: "Ready",
    description: "Annual wellness trends and health improvement insights",
    size: "2.8 MB",
    pages: 15,
    icon: TrendingUp
  }
]

const healthMetrics = [
  { label: "Reports Generated", value: "24", change: "+12%", color: "blue" },
  { label: "Data Points", value: "1,247", change: "+8%", color: "green" },
  { label: "Health Score", value: "85/100", change: "+5%", color: "purple" },
  { label: "Compliance Rate", value: "92%", change: "+3%", color: "orange" }
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

export default function ReportsPage() {
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
            <h1 className="text-3xl font-bold text-gray-900">Health Reports</h1>
            <p className="text-gray-600 mt-1">Access and download your health reports and analytics</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
          </div>
        </motion.div>

        {/* Health Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {healthMetrics.map((metric, index) => (
            <motion.div key={metric.label} variants={itemVariants}>
              <Card className={`bg-${metric.color}-50 border-${metric.color}-200`}>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className={`text-${metric.color}-600 font-medium text-sm`}>{metric.label}</p>
                    <p className={`text-2xl font-bold text-${metric.color}-700 mt-1`}>{metric.value}</p>
                    <p className={`text-xs text-${metric.color}-600 mt-1`}>{metric.change} from last month</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Reports List */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Available Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <report.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{report.title}</h3>
                        <Badge 
                          variant={report.status === 'Ready' ? 'default' : 'secondary'}
                          className={report.status === 'Ready' ? 'bg-green-100 text-green-700' : ''}
                        >
                          {report.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {report.date}
                        </span>
                        <span>{report.type}</span>
                        <span>{report.size}</span>
                        <span>{report.pages} pages</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                    <Button 
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={report.status !== 'Ready'}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Need a Custom Report?</h3>
                <p className="text-gray-600 mb-4">
                  Generate personalized health reports based on specific date ranges and metrics
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Custom Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </MainLayout>
  )
}
