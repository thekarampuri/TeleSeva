"use client"

import React, { useState } from "react"
import Spline from "@splinetool/react-spline"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowDown, Video, BrainCircuit, Pill, Ambulance, MapPin, BarChart2, UserCheck } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Navbar } from "../../components/navbar"
import { useAuth } from "@/contexts/AuthContext"

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
}

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const staggerContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const featuresData = [
  {
    icon: <Video className="h-8 w-8 text-primary" />,
    title: "Telemedicine Consultations",
    problem: "Difficulty accessing doctors due to distance, mobility, or busy schedules.",
    solution: "Connect with certified doctors via secure video calls, right from your home, anytime.",
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: "AI Symptom Checker",
    problem: "Uncertainty about symptoms and when to seek professional medical advice.",
    solution:
      "Get a preliminary analysis of your symptoms with our intelligent, AI-powered tool for informed decisions.",
  },
  {
    icon: <Pill className="h-8 w-8 text-primary" />,
    title: "Medicine Management",
    problem: "Forgetting medication or struggling to manage multiple prescriptions.",
    solution: "Track your prescriptions, set smart reminders, and manage refills effortlessly.",
  },
  {
    icon: <Ambulance className="h-8 w-8 text-primary" />,
    title: "Emergency Services",
    problem: "Delay in accessing help during critical medical emergencies.",
    solution: "One-tap access to emergency contacts and services when every second counts.",
  },
  {
    icon: <MapPin className="h-8 w-8 text-primary" />,
    title: "Facility Finder",
    problem: "Trouble locating suitable healthcare facilities, especially in unfamiliar areas.",
    solution: "Quickly locate nearby hospitals, clinics, and pharmacies with our integrated map.",
  },
  {
    icon: <BarChart2 className="h-8 w-8 text-primary" />,
    title: "Health Reports",
    problem: "Fragmented health data making it hard to track progress or share with doctors.",
    solution:
      "Visualize your personal health data and track your progress over time with insightful, shareable reports.",
  },
]

const developers = [
  { name: "Omkar Gondkar", role: "Lead Developer", avatar: "/placeholder-user.jpg" },
  { name: "Akhil Karampuri", role: "Lead Developer", avatar: "/placeholder-user.jpg" },
]

export default function LandingPage() {
  const { user } = useAuth();
  const [splineError, setSplineError] = useState(false);
  
  const handleSplineError = () => {
    console.error("Failed to load Spline scene");
    setSplineError(true);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="w-full min-h-screen bg-background text-foreground"
    >
      <Navbar />

      {/* Hero Section with Spline */}
      <section className="relative w-full h-screen bg-black">
        <div className="absolute top-0 left-0 w-full h-full z-0 opacity-80">
          {/* Spline 3D component with fallback */}
          <div className="w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-black"></div>
            <div className="absolute inset-0 opacity-30">
              <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent blur-xl"></div>
              <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent blur-xl"></div>
            </div>
            <div className="relative w-full h-full">
              {!splineError ? (
                <Spline 
                  scene="https://prod.spline.design/I3zkITBs4HqU6-T7/scene.splinecode" 
                  onError={handleSplineError}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="h-32 w-32 rounded-full bg-blue-500/20 mb-4"></div>
                    <div className="h-4 w-32 bg-blue-500/20 rounded mb-2"></div>
                    <div className="h-4 w-48 bg-blue-500/20 rounded"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-4">
          {/* TeleSeva component removed to fix hydration issues */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="absolute bottom-10 animate-bounce"
          >
            <ArrowDown className="h-8 w-8 text-white" />
          </motion.div>
        </div>
      </section>

      {/* Main Content with White Background */}
      <main className="bg-background">
        {/* Problem & Solution Section */}
        <motion.section
          id="problem-solution"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="py-20"
        >
          <div className="container mx-auto px-4 text-center">
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-6">
              The Healthcare Maze: <span className="text-primary">Complex, Costly, Confusing.</span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="mt-4 max-w-3xl mx-auto text-muted-foreground text-lg leading-relaxed"
            >
              Navigating healthcare today often means battling long waits, high costs, and fragmented information.
              Accessing timely medical advice, managing chronic conditions, or even finding the right specialist can
              feel overwhelming. This complexity creates barriers, preventing individuals from receiving proactive and
              personalized care.
            </motion.p>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          id="features"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="py-20 bg-muted"
        >
          <div className="container mx-auto px-4">
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">Your All-in-One Health Hub</h2>
              <p className="mt-2 text-muted-foreground text-lg">
                Discover how our platform addresses your healthcare needs.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuresData.map((feature) => (
                <motion.div key={feature.title} variants={itemVariants}>
                  <Card className="bg-background h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-start gap-4 pb-3">
                      {feature.icon}
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-destructive mb-1 font-medium">
                        Problem: <span className="text-muted-foreground font-normal">{feature.problem}</span>
                      </p>
                      <p className="text-sm text-primary mb-2 font-medium">
                        Solution: <span className="text-muted-foreground font-normal">{feature.solution}</span>
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Developers Section */}
        <motion.section
          id="team"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="py-20"
        >
          <div className="container mx-auto px-4">
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Crafted with Passion at Hackstorm</h2>
              <p className="mt-2 text-muted-foreground">Meet the innovative minds behind this project.</p>
            </motion.div>
            <motion.div variants={staggerContainerVariants} className="flex flex-wrap justify-center gap-8 md:gap-12">
              {developers.map((dev) => (
                <motion.div
                  key={dev.name}
                  variants={itemVariants}
                  className="text-center"
                >
                  <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-primary/20">
                    <AvatarImage src={dev.avatar} alt={dev.name} />
                    <AvatarFallback>{dev.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg">{dev.name}</h3>
                  <p className="text-sm text-muted-foreground">{dev.role}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
        >
          <div className="container mx-auto px-4 text-center">
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Healthcare Experience?
            </motion.h2>
            <motion.p variants={itemVariants} className="max-w-2xl mx-auto mb-8 text-blue-100">
              Join thousands of users who have already discovered the convenience and quality of our healthcare platform.
            </motion.p>
            <motion.div variants={itemVariants} className="flex justify-center">
              <Button
                size="lg"
                asChild
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg transform hover:scale-105 transition-all px-8 py-4"
              >
                <Link href="/auth">
                  <UserCheck className="mr-2 h-5 w-5" />
                  Signup / Login
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="py-12 bg-gray-900 text-gray-400">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">TeleSeva</h2>
              <p className="mb-8">Your Health, Our Priority</p>
              <p className="text-sm">© 2023 TeleSeva. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </motion.div>
  )
}