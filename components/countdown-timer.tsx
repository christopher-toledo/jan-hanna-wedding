"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const WEDDING_DATE = new Date("2025-09-23T15:00:00"); // September 23, 2025, at 3:00 PM

function getTimeRemaining(target: Date): CountdownTime {
  const now = new Date();
  const total = target.getTime() - now.getTime();
  const seconds = Math.max(Math.floor((total / 1000) % 60), 0);
  const minutes = Math.max(Math.floor((total / 1000 / 60) % 60), 0);
  const hours = Math.max(Math.floor((total / (1000 * 60 * 60)) % 24), 0);
  const days = Math.max(Math.floor(total / (1000 * 60 * 60 * 24)), 0);
  return { days, hours, minutes, seconds };
}

export default function CountdownTimer() {
  // Hydration fix: Don't render timer until after mount
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeRemaining(WEDDING_DATE));
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(WEDDING_DATE));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isOver =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  if (!mounted) {
    // Prevent hydration mismatch by rendering nothing until mounted
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <h2 className="font-serif text-2xl xs:text-3xl sm:text-4xl md:text-6xl font-medium text-midnightBlue mb-4 text-center px-2">
        DAYS LEFT BEFORE WE SAY I DO
      </h2>

      <div className="flex flex-col items-center justify-center w-full">
        {isOver ? (
          <div className="text-2xl xs:text-3xl sm:text-4xl font-serif text-midnightBlue font-bold py-8 text-center">
            The celebration has begun!
          </div>
        ) : (
          <div className="flex flex-nowrap gap-2 xs:gap-3 sm:gap-4 md:gap-8 text-midnightBlue items-start w-full justify-center overflow-x-auto">
            <CountdownUnit value={timeLeft.days} label="Days" />
            <span className="text-[40px] xs:text-[60px] sm:text-[70px] md:text-[90px] font-bold font-spartan leading-none mx-0 xs:mx-1 pt-1 xs:pt-2 align-top">
              :
            </span>
            <CountdownUnit value={timeLeft.hours} label="Hours" />
            <span className="text-[40px] xs:text-[60px] sm:text-[70px] md:text-[90px] font-bold font-spartan leading-none mx-0 xs:mx-1 pt-1 xs:pt-2 align-top">
              :
            </span>
            <CountdownUnit value={timeLeft.minutes} label="Minutes" />
            <span className="text-[40px] xs:text-[60px] sm:text-[70px] md:text-[90px] font-bold font-spartan leading-none mx-0 xs:mx-1 pt-1 xs:pt-2 align-top">
              :
            </span>
            <CountdownUnit value={timeLeft.seconds} label="Seconds" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[60px] xs:min-w-[70px] sm:min-w-[80px] md:min-w-[90px]">
      <span className="font-bold font-spartan drop-shadow-lg text-[48px] xs:text-[60px] sm:text-[80px] md:text-[100px] text-midnightBlue leading-none">
        {value.toString().padStart(2, "0")}
      </span>
      <span className="font-montserrat text-[18px] xs:text-[22px] sm:text-[28px] md:text-[40px] font-medium mt-2 tracking-wide uppercase text-midnightBlue leading-tight">
        {label}
      </span>
    </div>
  );
}
