"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  Clock,
  Heart,
  Sparkles,
  ArrowDown,
  Camera,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { GalleryGrid } from "@/components/gallery-grid";
import { ImageUpload } from "@/components/image-upload";
import CountdownTimer from "@/components/countdown-timer";

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [galleryRefreshTrigger, setGalleryRefreshTrigger] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleUploadSuccess = () => {
    // Trigger gallery refresh
    setGalleryRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section with Parallax */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <div
          className="absolute inset-0 z-0"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <Image
            src="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Wedding venue"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20" />
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 opacity-30"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="h-8 w-8 text-white" />
        </motion.div>

        <motion.div
          className="absolute bottom-32 right-16 opacity-30"
          animate={{
            y: [0, -15, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Heart className="h-12 w-12 text-white" />
        </motion.div>

        <motion.div
          className="absolute top-1/3 right-20 opacity-20"
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <Sparkles className="h-6 w-6 text-white" />
        </motion.div>

        {/* Main Content */}
        <div className="relative z-10 text-center space-y-8 px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-6"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-sm tracking-[0.3em] uppercase text-white/80 font-medium"
            >
              Together Forever
            </motion.p>

            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-none drop-shadow-lg"
              >
                Jan Bennette
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
                className="flex items-center justify-center space-x-6"
              >
                <div className="h-px bg-white/40 w-16"></div>
                <Heart className="h-8 w-8 text-white drop-shadow-lg" />
                <div className="h-px bg-white/40 w-16"></div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.8, ease: "easeOut" }}
                className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-none drop-shadow-lg"
              >
                Hanna Jane
              </motion.h1>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="space-y-6"
            >
              <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed drop-shadow">
                We joyfully invite you to celebrate our union as we begin this
                beautiful journey together
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    size="lg"
                    className="border bg-white/90 hover:bg-white text-primary px-8 py-6 text-base font-medium tracking-wide shadow-2xl backdrop-blur-sm"
                  >
                    <Link href="/information">View Wedding Details</Link>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="border border-white text-white hover:bg-white hover:text-primary backdrop-blur-sm px-8 py-6 text-base font-medium tracking-wide shadow-lg"
                    onClick={() =>
                      document
                        .getElementById("gallery")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Explore Gallery
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="flex flex-col items-center space-y-2"
          >
            <span className="text-sm tracking-wide">Scroll to explore</span>
            <ArrowDown className="h-5 w-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* Countdown Timer Section */}
      <section className="py-4 bg-linen relative overflow-hidden">
        <div className="container mx-auto px-6 flex flex-col items-center justify-center text-center">
          <CountdownTimer />
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl text-primary mb-4">
              Our Love Story
            </h2>
            <div className="w-24 h-px bg-primary/30 mx-auto"></div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="font-serif text-3xl text-primary">How We Met</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our paths crossed on a beautiful spring day in 2021 at a local
                bookstore café. What started as a chance encounter over a shared
                love for literature turned into hours of conversation, laughter,
                and the beginning of our beautiful love story.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                From that moment, we knew we had found something special.
                Through adventures, challenges, and countless memories, our love
                has grown stronger each day. Now, we're ready to take the next
                step in our journey together.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Couple portrait"
                  width={600}
                  height={400}
                  className="object-cover w-full h-[400px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Decorative Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="absolute -top-4 -right-4 w-8 h-8 border-2 border-primary/30 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{
                  duration: 15,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="absolute -bottom-4 -left-4 w-6 h-6 border-2 border-primary/20 rounded-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Wedding Details Preview */}
      <section className="py-24 elegant-gradient relative overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl text-primary mb-4">
              Join Us
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We can't wait to celebrate this special day with our loved ones
            </p>
            <div className="w-24 h-px bg-primary/30 mx-auto mt-4"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Calendar,
                title: "When",
                details: ["Tuesday", "September 23, 2025", "4:00 PM"],
                delay: 0,
              },
              {
                icon: MapPin,
                title: "Where",
                details: [
                  "Sunset Gardens",
                  "123 Wedding Lane",
                  "Beautiful City, BC",
                ],
                delay: 0.2,
              },
              {
                icon: Clock,
                title: "Reception",
                details: ["Following Ceremony", "6:00 PM", "Same Location"],
                delay: 0.4,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: item.delay }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <Card className="text-center elegant-shadow hover:shadow-2xl transition-all duration-500 elegant-border group bg-white/80 backdrop-blur-sm">
                  <CardContent className="pt-12 pb-8 px-8">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="relative mb-8"
                    >
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors duration-300">
                        <item.icon className="h-10 w-10 text-primary" />
                      </div>
                    </motion.div>
                    <h3 className="font-serif text-2xl text-primary mb-4">
                      {item.title}
                    </h3>
                    <div className="space-y-2 text-muted-foreground">
                      {item.details.map((detail, i) => (
                        <p
                          key={i}
                          className={
                            i === 1
                              ? "text-xl font-serif text-primary"
                              : "text-base"
                          }
                        >
                          {detail}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base font-medium tracking-wide elegant-shadow"
              >
                <Link href="/information">View Full Details</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Background Decorations */}
        <div className="absolute top-10 left-10 opacity-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 30,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <Sparkles className="h-16 w-16 text-primary" />
          </motion.div>
        </div>
        <div className="absolute bottom-10 right-10 opacity-10">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <Heart className="h-20 w-20 text-primary" />
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl text-primary mb-4">
              Wedding Gallery
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Share your favorite moments with us and create lasting memories
              together
            </p>
            <div className="w-24 h-px bg-primary/30 mx-auto mt-4"></div>
          </motion.div>

          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto mb-16"
          >
            <Card className="elegant-shadow elegant-border">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-2xl text-primary mb-2">
                    Share Your Photos
                  </h3>
                  <p className="text-muted-foreground">
                    Upload your beautiful moments from our special day
                  </p>
                </div>
                <ImageUpload onUploadSuccess={handleUploadSuccess} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Gallery Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <GalleryGrid refreshTrigger={galleryRefreshTrigger} />
          </motion.div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Wedding background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-primary/80"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl text-white leading-relaxed mb-8">
              "Being deeply loved by someone gives you strength, while loving
              someone deeply gives you courage."
            </blockquote>
            <cite className="text-white/80 text-lg tracking-wide">
              — Lao Tzu
            </cite>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
