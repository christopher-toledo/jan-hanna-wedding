"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  ArrowDown,
  Camera,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { GalleryGrid } from "@/components/gallery-grid";
import CountdownTimer from "@/components/countdown-timer";

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section with Parallax */}
      <section className="relative min-h-[60vh] md:min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <div
          className="absolute inset-0 z-0"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <Image
            src="/images/MainBanner.jpg"
            alt="Wedding venue"
            fill
            className="object-cover object-top md:object-center scale-120 md:scale-100"
            priority
          />
          <div className="absolute inset-0 bg-black/5" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center space-y-8 px-6 max-w-4xl mx-auto -mt-2 md:-mt-80">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                className="font-serif text-7xl xs:text-8xl sm:text-8xl md:text-8xl lg:text-[10rem] text-darkGrayBlue leading-none drop-shadow-lg"
              >
                HANNA
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
                className="flex items-center justify-center space-x-6"
              >
                <Image
                  src="/images/and.png"
                  alt="and"
                  width={300}
                  height={0}
                  className="drop-shadow-lg h-auto w-24 xs:w-32 sm:w-40 md:w-48 lg:w-56"
                  sizes="(max-width: 640px) 6rem, (max-width: 768px) 8rem, (max-width: 1024px) 10rem, 14rem"
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3, duration: 0.8, ease: "easeOut" }}
                className="font-serif text-7xl xs:text-8xl sm:text-8xl md:text-8xl lg:text-[10rem] text-darkGrayBlue leading-none drop-shadow-lg"
              >
                JAN
              </motion.h1>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="space-y-6"
            >
              <p className="mt-8 text-xl md:text-6xl text-darkGrayBlue font-alta max-w-2xl mx-auto leading-relaxed drop-shadow">
                09.23.2025
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      <section id="save-the-date">
        <div className="py-8 bg-linen"></div>
      </section>
      {/* Countdown Timer Section */}
      <section className="pb-4 bg-linen relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-6 flex flex-col items-center justify-center text-center">
            <CountdownTimer />
          </div>
          <div className="container mx-auto px-6 sm:px-6">
            {/* Countdown Gallery */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
              <div className="aspect-square w-full relative overflow-hidden shadow-lg">
                <Image
                  src="/images/countdown-1.jpg"
                  alt="Countdown 1"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="aspect-square w-full relative overflow-hidden shadow-lg">
                <Image
                  src="/images/countdown-2.jpg"
                  alt="Countdown 2"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="aspect-square w-full relative overflow-hidden shadow-lg">
                <Image
                  src="/images/countdown-3.jpg"
                  alt="Countdown 3"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </motion.div>
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
      <section id="details" className="py-8 bg-linen relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-the-seasons text-5xl md:text-7xl text-darkGrayBlue tracking-widest">
              THE WEDDING DETAILS
            </h2>
          </motion.div>
          {/* Full-width, foreground Wedding Details Image */}
          <div className="relative w-screen left-1/2 right-1/2 -translate-x-1/2 mb-8">
            <Image
              src="/images/weddingDetails.jpg"
              alt="Wedding Details"
              width={1920}
              height={600}
              className="block w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] object-cover object-center"
              priority={false}
            />
          </div>
        </div>
      </section>
      {/* Wedding Details - Venue */}
      <section className="pb-8 bg-linen relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-the-seasons text-6xl md:text-8xl text-darkGrayBlue tracking-widest">
            VENUE
          </h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center mt-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="w-full md:w-1/2 max-w-xl overflow-hidden flex flex-col items-center h-full"
            >
              <Image
                src="/images/venue-church.png"
                alt="Ceremony Venue"
                width={800}
                height={600}
                className="object-cover w-full h-[250px] md:h-[350px]"
                priority={false}
              />
              <div className="flex-1 flex flex-col justify-end items-center w-full">
                <p className="font-montserrat font-bold text-[20px] text-darkGrayBlue uppercase text-center mt-2 w-full">
                  Diocesan Shrine and Parish of Saint Pio of Pietrelcina Church
                </p>
                <p className="font-montserrat text-[16px] text-darkGrayBlue text-center mt-1 w-full uppercase">
                  106 Sumulong Hwy, Antipolo City, 1870 Rizal
                </p>
                <p className="font-montserrat text-[18px] text-darkGrayBlue text-center mt-4 w-full uppercase">
                  Ceremony starts at 3:00 PM
                </p>
                <button
                  type="button"
                  className="mt-4 px-6 py-2 border-2 border-darkGrayBlue rounded-[12px] font-montserrat text-[18px] text-darkGrayBlue uppercase text-center transition-colors hover:bg-darkGrayBlue hover:text-white"
                  onClick={() =>
                    window.open(
                      "https://maps.app.goo.gl/otwchXhayKxvai4P9",
                      "_blank"
                    )
                  }
                >
                  View Map
                </button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="w-full md:w-1/2 max-w-xl overflow-hidden flex flex-col items-center h-full"
            >
              <Image
                src="/images/venue-reception-1.png"
                alt="Reception Venue"
                width={800}
                height={600}
                className="object-cover w-full h-[250px] md:h-[350px]"
                priority={false}
              />
              <div className="flex-1 flex flex-col justify-end items-center w-full">
                <p className="font-montserrat font-bold text-[20px] text-darkGrayBlue uppercase text-center mt-2 w-full">
                  Villa Ardin Events Place
                </p>
                <p className="font-montserrat text-[16px] text-darkGrayBlue text-center mt-1 w-full uppercase">
                  Valley Golf Hills, Don Celso S. Tuason Ave, Cainta, 1870 Rizal
                </p>
                <p
                  className="font-montserrat text-[16px] text-darkGrayBlue text-center mt-1 w-full uppercase"
                  aria-hidden="true"
                >
                  &nbsp;
                </p>
                <p className="font-montserrat text-[18px] text-darkGrayBlue text-center mt-4 w-full uppercase">
                  Reception follows at 6:00 PM
                </p>
                <button
                  type="button"
                  className="mt-4 px-6 py-2 border-2 border-darkGrayBlue rounded-[12px] font-montserrat text-[18px] text-darkGrayBlue uppercase text-center transition-colors hover:bg-darkGrayBlue hover:text-white"
                  onClick={() =>
                    window.open(
                      "https://maps.app.goo.gl/uUMv4PPDTMPX6DJD9",
                      "_blank"
                    )
                  }
                >
                  View Map
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Gallery Preview Section */}
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
              Beautiful moments from our special day
            </p>
            <div className="w-24 h-px bg-primary/30 mx-auto mt-4"></div>
          </motion.div>

          {/* Gallery Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <GalleryGrid isPreview={true} />
          </motion.div>

          {/* View More Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 text-base font-medium tracking-wide elegant-shadow"
              >
                <Link href="/gallery">
                  <Camera className="h-5 w-5 mr-2" />
                  View More Photos
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
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
