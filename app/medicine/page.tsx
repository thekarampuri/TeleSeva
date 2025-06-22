"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainLayout } from "@/components/layout/main-layout"
import { Upload, MapPin, Clock, Truck, Bell, Camera, Star, DollarSign, Package, CheckCircle } from "lucide-react"

const pharmacies = [
  {
    id: 1,
    name: "Apollo Pharmacy",
    distance: "0.5 km",
    rating: 4.8,
    deliveryTime: "30 min",
    deliveryFee: "₹25",
    available: true,
  },
  {
    id: 2,
    name: "MedPlus",
    distance: "1.2 km",
    rating: 4.6,
    deliveryTime: "45 min",
    deliveryFee: "₹30",
    available: true,
  },
  {
    id: 3,
    name: "Wellness Forever",
    distance: "2.1 km",
    rating: 4.7,
    deliveryTime: "60 min",
    deliveryFee: "₹40",
    available: false,
  },
]

const genericAlternatives = [
  {
    brand: "Crocin 650mg",
    generic: "Paracetamol 650mg",
    savings: "₹45",
    availability: "In Stock",
  },
  {
    brand: "Augmentin 625mg",
    generic: "Amoxicillin + Clavulanate 625mg",
    savings: "₹120",
    availability: "In Stock",
  },
  {
    brand: "Pantop 40mg",
    generic: "Pantoprazole 40mg",
    savings: "₹85",
    availability: "Limited Stock",
  },
]

const orderStatus = [
  { step: "Order Placed", completed: true, time: "2:30 PM" },
  { step: "Prescription Verified", completed: true, time: "2:45 PM" },
  { step: "Preparing Order", completed: true, time: "3:00 PM" },
  { step: "Out for Delivery", completed: false, time: "Expected: 4:00 PM" },
  { step: "Delivered", completed: false, time: "Expected: 4:30 PM" },
]

export default function MedicinePage() {
  const [selectedPharmacy, setSelectedPharmacy] = useState<number | null>(null)
  const [prescriptionUploaded, setPrescriptionUploaded] = useState(false)

  const handlePrescriptionUpload = () => {
    setPrescriptionUploaded(true)
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Medicine Delivery</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload your prescription, choose generic alternatives, and get medicines delivered to your doorstep.
          </p>
        </div>

        <Tabs defaultValue="order" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="order">Order Medicine</TabsTrigger>
            <TabsTrigger value="track">Track Order</TabsTrigger>
            <TabsTrigger value="refill">Auto Refill</TabsTrigger>
            <TabsTrigger value="history">Order History</TabsTrigger>
          </TabsList>

          <TabsContent value="order" className="space-y-6">
            {/* Prescription Upload */}
            <Card className="bg-white/80 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2 text-blue-600" />
                  Upload Prescription
                </CardTitle>
                <CardDescription>Upload a clear photo of your prescription or take a new photo</CardDescription>
              </CardHeader>
              <CardContent>
                {!prescriptionUploaded ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="space-y-4">
                      <div className="flex justify-center space-x-4">
                        <Button onClick={handlePrescriptionUpload} className="flex items-center">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Image
                        </Button>
                        <Button variant="outline" onClick={handlePrescriptionUpload} className="flex items-center">
                          <Camera className="h-4 w-4 mr-2" />
                          Take Photo
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">Supported formats: JPG, PNG, PDF (Max 5MB)</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-green-800 font-medium">Prescription uploaded successfully!</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      Our pharmacist will verify your prescription within 15 minutes.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Generic Alternatives */}
            {prescriptionUploaded && (
              <Card className="bg-white/80 backdrop-blur-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                    Generic Alternatives Available
                  </CardTitle>
                  <CardDescription>
                    Save money with generic alternatives that have the same active ingredients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {genericAlternatives.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">{item.brand}</span>
                            <span className="text-gray-500">→</span>
                            <span className="font-medium text-green-600">{item.generic}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Save {item.savings}
                            </Badge>
                            <span className="text-gray-500">{item.availability}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Choose Generic
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pharmacy Selection */}
            {prescriptionUploaded && (
              <Card className="bg-white/80 backdrop-blur-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-purple-600" />
                    Choose Nearby Pharmacy
                  </CardTitle>
                  <CardDescription>Select a pharmacy for delivery based on distance and delivery time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pharmacies.map((pharmacy) => (
                      <div
                        key={pharmacy.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedPharmacy === pharmacy.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        } ${!pharmacy.available ? "opacity-50" : ""}`}
                        onClick={() => pharmacy.available && setSelectedPharmacy(pharmacy.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-gray-900">{pharmacy.name}</h3>
                              {!pharmacy.available && <Badge variant="secondary">Closed</Badge>}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {pharmacy.distance}
                              </div>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                {pharmacy.rating}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {pharmacy.deliveryTime}
                              </div>
                              <div className="flex items-center">
                                <Truck className="h-4 w-4 mr-1" />
                                {pharmacy.deliveryFee}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Place Order */}
            {prescriptionUploaded && selectedPharmacy && (
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">Ready to Order?</h3>
                      <p className="text-green-100">
                        Delivery from {pharmacies.find((p) => p.id === selectedPharmacy)?.name}
                      </p>
                    </div>
                    <Button size="lg" className="bg-white text-green-600 hover:bg-green-50">
                      <Package className="h-5 w-5 mr-2" />
                      Place Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="track" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-blue-600" />
                  Order Tracking
                </CardTitle>
                <CardDescription>Track your medicine delivery in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-blue-900">Order #MD12345</span>
                      <Badge className="bg-blue-600">In Transit</Badge>
                    </div>
                    <p className="text-sm text-blue-700">Expected delivery: 4:30 PM today</p>
                  </div>

                  <div className="space-y-4">
                    {orderStatus.map((status, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className={`w-4 h-4 rounded-full ${status.completed ? "bg-green-500" : "bg-gray-300"}`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`font-medium ${status.completed ? "text-green-700" : "text-gray-500"}`}>
                              {status.step}
                            </span>
                            <span className="text-sm text-gray-500">{status.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="refill" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-orange-600" />
                  Auto Refill Setup
                </CardTitle>
                <CardDescription>Set up automatic refill reminders for your regular medications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">Metformin 500mg</h4>
                        <p className="text-sm text-gray-500">Take twice daily</p>
                      </div>
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        Refill in 5 days
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Label htmlFor="refill-days" className="text-sm">
                        Remind me
                      </Label>
                      <Input id="refill-days" type="number" defaultValue="7" className="w-20" />
                      <span className="text-sm text-gray-500">days before running out</span>
                      <Button size="sm">Set Reminder</Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">Lisinopril 10mg</h4>
                        <p className="text-sm text-gray-500">Take once daily</p>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Auto-refill enabled
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">Next refill: March 15, 2024</p>
                  </div>

                  <Button className="w-full" variant="outline">
                    <Bell className="h-4 w-4 mr-2" />
                    Add New Medication
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2 text-gray-600" />
                  Order History
                </CardTitle>
                <CardDescription>View your past medicine orders and reorder easily</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: "MD12345", date: "March 10, 2024", items: 3, total: "₹450", status: "Delivered" },
                    { id: "MD12344", date: "March 5, 2024", items: 2, total: "₹320", status: "Delivered" },
                    { id: "MD12343", date: "February 28, 2024", items: 4, total: "₹680", status: "Delivered" },
                  ].map((order) => (
                    <div key={order.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">Order #{order.id}</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {order.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{order.date}</span>
                            <span>{order.items} items</span>
                            <span className="font-medium text-gray-900">{order.total}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          <Button size="sm">Reorder</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
