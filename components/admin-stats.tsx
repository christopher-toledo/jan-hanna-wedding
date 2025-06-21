"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, Calendar, Camera } from "lucide-react";

interface Stats {
  totalGuests: number;
  attendingGuests: number;
  notAttendingGuests: number;
  pendingGuests: number;
  additionalGuests: number;
  totalImages: number;
  rsvpResponses: number;
}

export function AdminStats() {
  const [stats, setStats] = useState<Stats>({
    totalGuests: 0,
    attendingGuests: 0,
    notAttendingGuests: 0,
    pendingGuests: 0,
    additionalGuests: 0,
    totalImages: 0,
    rsvpResponses: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Guests",
      value: stats.totalGuests,
      icon: Users,
      description: "All invited guests",
      color: "text-blue-600",
    },
    {
      title: "Attending",
      value: stats.attendingGuests,
      icon: UserCheck,
      description: "Confirmed attendance",
      color: "text-green-600",
    },
    {
      title: "Not Attending",
      value: stats.notAttendingGuests,
      icon: UserX,
      description: "Declined invitation",
      color: "text-red-600",
    },
    {
      title: "Pending",
      value: stats.pendingGuests,
      icon: Calendar,
      description: "Awaiting response",
      color: "text-yellow-600",
    },
    {
      title: "Gallery Images",
      value: stats.totalImages,
      icon: Camera,
      description: "Uploaded photos",
      color: "text-pink-600",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat, index) => (
        <Card
          key={index}
          className="elegant-shadow hover:shadow-lg transition-shadow"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
