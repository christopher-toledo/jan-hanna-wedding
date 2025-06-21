"use client";

import { useEffect, useState } from "react";

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
  const [timeLeft, setTimeLeft] = useState<CountdownTime>(() => getTimeRemaining(WEDDING_DATE));

  useEffect(() => {
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

  return (
    <div className="flex flex-col items-center justify-center">
      {isOver ? (
        <div className="text-3xl font-serif text-white font-bold py-8">The celebration has begun!</div>
      ) : (
        <div className="flex gap-6 md:gap-12 text-white">
          <CountdownUnit value={timeLeft.days} label="Days" />
          <CountdownUnit value={timeLeft.hours} label="Hours" />
          <CountdownUnit value={timeLeft.minutes} label="Minutes" />
          <CountdownUnit value={timeLeft.seconds} label="Seconds" />
        </div>
      )}
    </div>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-5xl md:text-6xl font-bold font-mono drop-shadow-lg">{value.toString().padStart(2, "0")}</span>
      <span className="text-base md:text-lg font-medium mt-2 tracking-wide uppercase opacity-80">{label}</span>
    </div>
  );
}
