"use client";

import CountdownTimer from "@/components/countdown-timer";
import { GalleryGrid } from "@/components/gallery-grid";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export interface HomePageProps {
  guestId: string;
}

function HomePage({ guestId }: HomePageProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY - 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section with Parallax */}
      <section
        id="home"
        className="relative min-h-[60vh] md:min-h-screen flex items-center justify-center overflow-hidden"
      >
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
        <div className="relative z-10 text-center space-y-8 px-6 max-w-4xl mx-auto -mt-4 md:-mt-64">
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
                className="font-serif text-7xl xs:text-8xl sm:text-8xl md:text-8xl lg:text-[9rem] text-darkGrayBlue leading-none drop-shadow-lg"
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
                className="font-serif text-7xl xs:text-8xl sm:text-8xl md:text-8xl lg:text-[9rem] text-darkGrayBlue leading-none drop-shadow-lg"
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
      {/* Countdown Timer Section */}
      <section
        id="save-the-date"
        className="py-4 bg-linen relative overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto mb-4 px-6 flex flex-col items-center justify-center text-center">
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
      <section
        id="our-story"
        className="py-8 bg-linen relative overflow-hidden"
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-5xl md:text-7xl text-darkGrayBlue tracking-widest">
              A LOVE THAT BLOOMED
            </h2>
            <p className="font-pinyon_script tracking-wider text-4xl md:text-6xl text-darkGrayBlue mt-2 mb-4">
              10 years, forever to go
            </p>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Our Story Milestones Section */}
            <div className="w-full col-span-2">
              <div className="md:mx-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* First Met */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-40 h-40 mb-4">
                    <Image
                      src="/images/story-1.png"
                      alt="First Met"
                      fill
                      className="object-contain object-center"
                      priority={false}
                    />
                  </div>
                  <h3 className="font-cormorant font-bold text-xl md:text-2xl text-darkGrayBlue mb-1 uppercase">
                    First Met
                  </h3>
                  <p className="font-montserrat text-base md:text-lg text-darkGrayBlue">
                    September 26, 2014
                  </p>
                </div>
                {/* Became a Couple */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-40 h-40 mb-4">
                    <Image
                      src="/images/story-2.png"
                      alt="Became a Couple"
                      fill
                      className="object-contain object-center"
                      priority={false}
                    />
                  </div>
                  <h3 className="font-cormorant font-bold text-xl md:text-2xl text-darkGrayBlue mb-1 uppercase">
                    Became a Couple
                  </h3>
                  <p className="font-montserrat text-base md:text-lg text-darkGrayBlue">
                    March 14, 2015
                  </p>
                </div>
                {/* It's a Yes */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-40 h-40 mb-4">
                    <Image
                      src="/images/story-3.png"
                      alt="It's a Yes"
                      fill
                      className="object-contain object-center"
                      priority={false}
                    />
                  </div>
                  <h3 className="font-cormorant font-bold text-xl md:text-2xl text-darkGrayBlue mb-1 uppercase">
                    It's a Yes
                  </h3>
                  <p className="font-montserrat text-base md:text-lg text-darkGrayBlue">
                    January 14, 2024
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Our Story Narrative Section */}
          <div className="mt-24 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
            {/* Image Left - Only One Image */}
            <div className="bg-linen flex flex-row w-full h-auto md:h-auto">
              <div className="relative w-full aspect-square mb-0 md:mb-4">
                <Image
                  src="/images/story-5.png"
                  alt="Our Story"
                  fill
                  className="object-contain object-center"
                  priority={false}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
            {/* Text Right */}
            <div
              className="flex flex-col justify-center h-full text-left min-h-[340px]"
              style={{ height: "100%" }}
            >
              <h3 className="font-serif text-4xl md:text-5xl text-darkGrayBlue mb-6 text-center">
                Our Story
              </h3>
              <p className="font-montserrat text-lg md:text-xl text-darkGrayBlue whitespace-pre-line text-justify">
                We met in high school back in 2014. What started as a simple
                friendship soon grew into something neither of us expected—a
                love that has lasted and blossomed over the years.
                <br />
                Together, we’ve shared laughter, challenges, and countless
                memories that have shaped who we are today. Through every
                chapter of our lives, our love has grown stronger, and now we’re
                ready to start the next one as husband and wife. Thank you for
                being part of our journey. We can’t wait to celebrate this
                special day with all of you!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Details Preview */}
      <section id="details" className="pt-8 bg-linen relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-serif text-4xl md:text-7xl text-darkGrayBlue tracking-widest mb-4">
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

      {/* Wedding Day Timeline Section */}
      <section className="py-8 bg-linen relative overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl md:text-6xl text-darkGrayBlue tracking-widest mb-2">
              THE CELEBRATION
            </h2>
            <p className="font-montserrat text-lg md:text-xl text-darkGrayBlue mb-2">
              A day full of love, laughter, and memories
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* WE DO */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-40 h-40 mb-3">
                <Image
                  src="/images/details-1.png"
                  alt="Wedding Ceremony"
                  fill
                  className="object-contain object-center"
                  priority={false}
                />
              </div>
              <h3 className="font-cormorant font-bold text-2xl text-darkGrayBlue mb-1 uppercase">
                WE DO
              </h3>
              <p className="font-montserrat text-base text-darkGrayBlue">
                Wedding Ceremony
              </p>
              <p className="font-montserrat text-base text-darkGrayBlue">
                3:00 PM
              </p>
            </div>
            {/* WE DRINK */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-40 h-40 mb-3">
                <Image
                  src="/images/details-2.png"
                  alt="Cocktail Hour"
                  fill
                  className="object-contain object-center"
                  priority={false}
                />
              </div>
              <h3 className="font-cormorant font-bold text-2xl text-darkGrayBlue mb-1 uppercase">
                WE DRINK
              </h3>
              <p className="font-montserrat text-base text-darkGrayBlue">
                Cocktail Hour
              </p>
              <p className="font-montserrat text-base text-darkGrayBlue">
                5:00 PM
              </p>
            </div>
            {/* WE DINE */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-40 h-40 mb-3">
                <Image
                  src="/images/details-3.png"
                  alt="Dinner"
                  fill
                  className="object-contain object-center"
                  priority={false}
                />
              </div>
              <h3 className="font-cormorant font-bold text-2xl text-darkGrayBlue mb-1 uppercase">
                WE DINE
              </h3>
              <p className="font-montserrat text-base text-darkGrayBlue">
                Dinner
              </p>
              <p className="font-montserrat text-base text-darkGrayBlue">
                7:00 PM
              </p>
            </div>
            {/* WE DANCE */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-40 h-40 mb-3">
                <Image
                  src="/images/details-4.png"
                  alt="Party"
                  fill
                  className="object-contain object-center"
                  priority={false}
                />
              </div>
              <h3 className="font-cormorant font-bold text-2xl text-darkGrayBlue mb-1 uppercase">
                WE DANCE
              </h3>
              <p className="font-montserrat text-base text-darkGrayBlue">
                Party
              </p>
              <p className="font-montserrat text-base text-darkGrayBlue">
                10:00 PM
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Wedding Details - Venue */}
      <section className="py-8 bg-linen relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-serif text-5xl md:text-8xl text-darkGrayBlue tracking-widest">
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
              <div className="flex-1 flex flex-col justify-end items-center w-full px-4">
                <p className="font-montserrat font-bold text-[16px] md:text-[20px] text-darkGrayBlue uppercase text-center mt-2 w-full">
                  Diocesan Shrine and Parish of Saint Pio of Pietrelcina Church
                </p>
                <p className="font-montserrat text-[14px] md:text-[16px] text-darkGrayBlue text-center mt-1 w-full uppercase">
                  106 Sumulong Hwy, Antipolo City, 1870 Rizal
                </p>
                <p className="font-montserrat text-[16px] md:text-[18px] text-darkGrayBlue text-center mt-4 w-full uppercase">
                  Ceremony starts at 3:00 PM
                </p>
                <button
                  type="button"
                  className="mt-4 px-6 py-2 border-2 border-darkGrayBlue rounded-[12px] font-montserrat text-[16px] md:text-[18px] text-darkGrayBlue uppercase text-center transition-colors hover:bg-darkGrayBlue hover:text-white"
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
              <div className="flex-1 flex flex-col justify-end items-center w-full px-4">
                <p className="font-montserrat font-bold text-[18px] md:text-[20px] text-darkGrayBlue uppercase text-center mt-2 w-full">
                  Villa Ardin Events Place
                </p>
                <p className="font-montserrat text-[14px] md:text-[16px] text-darkGrayBlue text-center mt-1 w-full uppercase">
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
                  className="mt-4 px-6 py-2 border-2 border-darkGrayBlue rounded-[12px] font-montserrat text-[16px] md:text-[18px] text-darkGrayBlue uppercase text-center transition-colors hover:bg-darkGrayBlue hover:text-white"
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
      {/* Attire Inspiration Section */}
      <section id="attire" className="py-8 bg-linen relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-serif text-5xl md:text-7xl text-darkGrayBlue tracking-widest">
            ATTIRE INSPIRATION
          </h2>
          <p className="font-pinyon_script text-3xl md:text-5xl text-darkGrayBlue mt-8 mb-4">
            For Our Guests
          </p>
          <p className="font-montserrat text-base md:text-lg text-darkGrayBlue mb-4 max-w-3xl px-4 mx-auto uppercase">
            We kindly invite our guests to wear formal or semi-formal attire in
            the following colors to celebrate with us on our special day.
          </p>
          <p className="font-montserrat font-bold text-xl md:text-2xl text-darkGrayBlue uppercase text-center mt-8 mb-2">
            The Colours
          </p>
          <div className="flex justify-center mb-8">
            <Image
              src="/images/attire-palette.png"
              alt="Attire Colour Palette"
              width={600}
              height={120}
              className="object-contain w-auto h-24 md:h-32"
              priority={false}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-8 justify-center items-center mt-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="w-full md:w-1/2 max-w-xl overflow-hidden flex flex-col items-center h-full"
            >
              <Image
                src="/images/attire-men.png"
                alt="Men's Attire Inspiration"
                width={800}
                height={600}
                className="object-cover w-full h-[250px] md:h-[350px]"
                priority={false}
              />
              <div className="flex-1 flex flex-col justify-end items-center w-full px-4">
                <p className="font-montserrat font-bold text-[16px] md:text-[20px] text-darkGrayBlue uppercase text-center mt-2 w-full">
                  For the Gentlemen
                </p>
                <p className="font-montserrat text-[14px] md:text-[15px] text-darkGrayBlue text-center mt-1 w-full uppercase">
                  keep it cool and classy.
                  <br />
                  Light-colored coats, long sleeves, and trousers in soft,
                  natural shades are perfect. Just skip black, gray, white, and
                  denim for the day.
                </p>
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
                src="/images/attire-women.png"
                alt="Women's Attire Inspiration"
                width={800}
                height={600}
                className="object-cover w-full h-[250px] md:h-[350px]"
                priority={false}
              />
              <div className="flex-1 flex flex-col justify-end items-center w-full px-4">
                <p className="font-montserrat font-bold text-[16px] md:text-[20px] text-darkGrayBlue uppercase text-center mt-2 w-full">
                  For the Ladies
                </p>
                <p className="font-montserrat text-[14px] md:text-[15px] text-darkGrayBlue text-center mt-1 w-full uppercase">
                  go for light and airy look!
                  <br />
                  long dresses, summer dresses, jumpsuits, or trousers in soft
                  pastel shades, gentle florals, or any cheerful spring-inspired
                  colors.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Gallery Preview Section */}
      <section id="gallery" className="py-8 bg-linen">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="font-serif text-4xl md:text-6xl text-darkGrayBlue tracking-widest">
              OUR PRE-WEDDING PHOTOS
            </h2>
            {/* <p className="font-montserrat text-base md:text-lg text-darkGrayBlue max-w-2xl mx-auto uppercase">
              Beautiful moments from our special day
            </p> */}
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
              <button
                type="button"
                className="mt-4 px-8 py-4 border-2 border-darkGrayBlue rounded-[12px] font-montserrat text-base md:text-lg text-darkGrayBlue uppercase text-center transition-colors hover:bg-darkGrayBlue hover:text-white elegant-shadow inline-flex items-center gap-2"
                onClick={() => window.open("/gallery", "_self")}
              >
                <Camera className="h-5 w-5 mr-2" />
                View More Photos
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Secret RSVP Section */}
      {guestId && (
        <section id="rsvp" className="py-16 bg-linen relative overflow-hidden">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-4"
            >
              <h2 className="font-serif text-5xl md:text-7xl text-darkGrayBlue tracking-widest">
                RSVP
              </h2>
              <p className="font-brittany text-3xl md:text-5xl text-darkGrayBlue mt-4 mb-4">
                Will you be joining us?
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="p-8 mb-8">
                <h3 className="font-cormorant text-3xl text-darkGrayBlue mb-4">
                  We would be honored to have you celebrate this special day
                  with us!
                </h3>
                <p className="font-montserrat text-lg text-darkGrayBlue mb-2">
                  Please let us know if you'll be able to join us on our special
                  day. Your RSVP helps us make sure everything is perfect for
                  you and all our guests.
                </p>
                <p className="font-montserrat text-lg text-darkGrayBlue mb-2">
                  We wish to accommodate all our friends and family, but
                  resources are limited. We hope for your kind understanding by
                  not bringing plus ones to our event.
                </p>

                <p className="font-montserrat text-base text-muted-foreground mb-2">
                  Click the button below to confirm your attendance and help us
                  prepare for a wonderful celebration together.
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-center"
                >
                  <button
                    type="button"
                    className="mt-4 px-8 py-4 border-2 border-darkGrayBlue rounded-[12px] font-montserrat text-base md:text-lg text-darkGrayBlue uppercase text-center transition-colors hover:bg-darkGrayBlue hover:text-white elegant-shadow inline-flex items-center gap-2"
                    onClick={() => window.open(`/${guestId}/rsvp`, "_self")}
                  >
                    RSVP Form
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}

export default HomePage;
