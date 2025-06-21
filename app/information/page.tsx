"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MapPin, Clock, Gift, Car, Users, Music, Camera } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function InformationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Wedding details background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-white/90"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="font-serif text-5xl md:text-6xl text-primary mb-6">Wedding Details</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Everything you need to know about Jan & Hanna's special day
            </p>
            <div className="w-24 h-px bg-primary/30 mx-auto mt-6"></div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Main Details Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Ceremony Details */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="elegant-shadow hover:shadow-xl transition-all duration-500 elegant-border h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    Ceremony
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-lg text-primary mb-2">Date & Time</h4>
                      <p className="text-muted-foreground text-lg">Tuesday, September 23, 2025</p>
                      <p className="text-muted-foreground">Ceremony begins at 4:00 PM</p>
                      <p className="text-sm text-muted-foreground">Please arrive by 3:45 PM</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-primary mb-2">Location</h4>
                      <p className="text-muted-foreground">
                        <strong>Sunset Gardens</strong>
                        <br />
                        123 Wedding Lane
                        <br />
                        Beautiful City, BC 12345
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-primary mb-2">Dress Code</h4>
                      <p className="text-muted-foreground">Semi-formal attire requested</p>
                      <p className="text-sm text-muted-foreground">Garden party elegant</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Reception Details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="elegant-shadow hover:shadow-xl transition-all duration-500 elegant-border h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    Reception
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-lg text-primary mb-2">Time</h4>
                      <p className="text-muted-foreground text-lg">6:00 PM - 11:00 PM</p>
                      <p className="text-sm text-muted-foreground">Cocktail hour starts at 5:00 PM</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-primary mb-2">Location</h4>
                      <p className="text-muted-foreground">Same as ceremony venue</p>
                      <p className="text-sm text-muted-foreground">Beautiful outdoor pavilion</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-primary mb-2">Dinner</h4>
                      <p className="text-muted-foreground">Three-course plated dinner</p>
                      <p className="text-sm text-muted-foreground">Vegetarian and dietary options available</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Additional Information Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                icon: Car,
                title: "Travel & Parking",
                details: ["Free parking on-site", "Valet service available", "Uber/Lyft pickup area designated"],
              },
              {
                icon: Gift,
                title: "Registry & Gifts",
                details: ["Your presence is our present!", "No gifts necessary", "Donations to charity welcome"],
              },
              {
                icon: Camera,
                title: "Photography",
                details: [
                  "Professional photographer present",
                  "Please share your photos",
                  "Use our wedding hashtag: #JanAndHanna2025",
                ],
              },
              {
                icon: Music,
                title: "Entertainment",
                details: ["Live band during ceremony", "DJ for reception dancing", "Song requests welcome"],
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="elegant-shadow hover:shadow-lg transition-all duration-300 elegant-border h-full">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-lg">{item.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {item.details.map((detail, i) => (
                        <p key={i} className="text-sm text-muted-foreground">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Separator className="my-16" />

          {/* Wedding Day Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="elegant-shadow elegant-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  Wedding Day Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { time: "3:30 PM", event: "Guest arrival and seating", description: "Welcome drinks served" },
                    { time: "4:00 PM", event: "Ceremony begins", description: "Exchange of vows" },
                    { time: "4:30 PM", event: "Cocktail hour", description: "Photos and mingling" },
                    { time: "6:00 PM", event: "Reception dinner", description: "Three-course meal" },
                    { time: "8:00 PM", event: "First dance", description: "Dancing begins" },
                    { time: "10:00 PM", event: "Cake cutting", description: "Sweet celebration" },
                    { time: "11:00 PM", event: "Last dance", description: "Final celebration" },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-6 py-4 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex-shrink-0 w-20 text-right">
                        <span className="font-semibold text-primary text-lg">{item.time}</span>
                      </div>
                      <div className="flex-shrink-0 w-3 h-3 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-1">{item.event}</h4>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Accommodation Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <Card className="elegant-shadow elegant-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  Accommodation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-lg text-primary mb-3">Recommended Hotels</h4>
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <h5 className="font-semibold">Grand Hotel</h5>
                        <p className="text-sm text-muted-foreground">5 minutes drive from venue</p>
                        <p className="text-sm text-muted-foreground">Special wedding rate: $120/night</p>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <h5 className="font-semibold">Comfort Inn & Suites</h5>
                        <p className="text-sm text-muted-foreground">10 minutes drive from venue</p>
                        <p className="text-sm text-muted-foreground">Special wedding rate: $95/night</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-primary mb-3">Getting There</h4>
                    <div className="space-y-3">
                      <p className="text-muted-foreground">
                        <strong>From Airport:</strong> 25 minutes by car or taxi
                      </p>
                      <p className="text-muted-foreground">
                        <strong>Public Transit:</strong> Bus route 42 stops 2 blocks away
                      </p>
                      <p className="text-muted-foreground">
                        <strong>Parking:</strong> Free on-site parking for 200+ cars
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <Card className="elegant-shadow elegant-border bg-primary/5">
              <CardContent className="pt-8 text-center">
                <h3 className="font-serif text-2xl text-primary mb-4">Questions?</h3>
                <p className="text-muted-foreground mb-4">
                  We're here to help! Don't hesitate to reach out if you have any questions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <p className="text-muted-foreground">
                    <strong>Jan:</strong> (555) 123-4567
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Hanna:</strong> (555) 987-6543
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mt-4">Email: hello@janandhanna.com</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
