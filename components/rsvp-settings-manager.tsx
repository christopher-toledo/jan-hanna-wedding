"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, MessageSquare, Settings } from "lucide-react";
import { toast } from "sonner";

interface RSVPSettings {
  enabled: boolean;
  deadline?: string;
  customMessage?: string;
}

// Utility functions for Philippine time (UTC+8)
function convertToPhilippineTime(utcDate: Date): Date {
  return new Date(utcDate.setHours(utcDate.getUTCHours() + 8));
}

function formatForDateTimeLocal(date: Date): string {
  // Add 8 hours to UTC time
  console.log("Formatting date for datetime-local:", date);
  // Format as yyyy-MM-ddTHH:mm (local time for UTC+8)
  const pad = (n: number) => n.toString().padStart(2, "0");
  const yyyy = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const HH = pad(date.getHours());
  const mm = pad(date.getMinutes());
  console.log(`${yyyy}-${MM}-${dd}T${HH}:${mm}`);
  return `${yyyy}-${MM}-${dd}T${HH}:${mm}`;
}

export function RSVPSettingsManager() {
  const [settings, setSettings] = useState<RSVPSettings>({
    enabled: true,
    deadline: undefined,
    customMessage: "RSVP submissions are currently closed.",
  });
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/rsvp-settings");
      const data = await response.json();
      setSettings(data.settings);
      setIsOpen(data.isOpen);
    } catch (error) {
      console.error("Error fetching RSVP settings:", error);
      toast.error("Failed to load RSVP settings");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    console.log(settings);
    try {
      const response = await fetch("/api/admin/rsvp-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (data.success) {
        setIsOpen(data.isOpen);
        toast.success("RSVP settings saved successfully!");
      } else {
        toast.error("Failed to save RSVP settings");
      }
    } catch (error) {
      console.error("Error saving RSVP settings:", error);
      toast.error("Failed to save RSVP settings");
    } finally {
      setSaving(false);
    }
  };

  const getDeadlineDisplay = () => {
    if (!settings.deadline) return "No deadline set";

    const deadlineDate = new Date(settings.deadline);
    return deadlineDate.toLocaleString("en-PH", {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeRemaining = () => {
    if (!settings.deadline) return null;
    const now = convertToPhilippineTime(new Date());
    const deadlineDate = new Date(settings.deadline);
    const diff = deadlineDate.getTime() - now.getTime();

    if (diff <= 0) return "Deadline has passed";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days} day${days !== 1 ? "s" : ""} and ${hours} hour${
        hours !== 1 ? "s" : ""
      } remaining`;
    } else {
      return `${hours} hour${hours !== 1 ? "s" : ""} remaining`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif text-primary">RSVP Settings</h2>
          <p className="text-muted-foreground">
            Manage RSVP submission availability and deadlines
          </p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {isOpen ? "RSVP Open" : "RSVP Closed"}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* RSVP Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              RSVP Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="rsvp-enabled" className="text-base">
                Enable RSVP Submissions
              </Label>
              <Switch
                id="rsvp-enabled"
                checked={settings.enabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, enabled: checked })
                }
              />
            </div>

            <div className="text-sm text-muted-foreground">
              {settings.enabled
                ? "Guests can submit and update their RSVPs"
                : "RSVP submissions are disabled"}
            </div>
          </CardContent>
        </Card>

        {/* Deadline Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              RSVP Deadline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="deadline" className="text-sm font-medium">
                Deadline (Philippine Time)
              </Label>
              <Input
                id="deadline"
                type="datetime-local"
                value={
                  settings.deadline
                    ? formatForDateTimeLocal(new Date(settings.deadline))
                    : ""
                }
                onChange={(e) => {
                  if (e.target.value) {
                    console.log(
                      formatForDateTimeLocal(new Date(e.target.value))
                    );
                    setSettings({
                      ...settings,
                      deadline: formatForDateTimeLocal(
                        new Date(e.target.value)
                      ),
                    });
                  } else {
                    setSettings({ ...settings, deadline: undefined });
                  }
                }}
                className="mt-1"
              />
            </div>

            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {getDeadlineDisplay()}
              </div>
              {getTimeRemaining() && (
                <div className="mt-1 text-xs">{getTimeRemaining()}</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Message Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Custom Message
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="custom-message" className="text-sm font-medium">
              Message when RSVP is closed
            </Label>
            <Textarea
              id="custom-message"
              value={settings.customMessage || ""}
              onChange={(e) =>
                setSettings({ ...settings, customMessage: e.target.value })
              }
              placeholder="Enter a custom message to display when RSVPs are closed..."
              className="mt-1 min-h-[100px]"
            />
          </div>

          <div className="text-sm text-muted-foreground">
            This message will be displayed to guests when RSVP submissions are
            disabled or past the deadline.
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={saveSettings}
          disabled={saving}
          className="bg-primary hover:bg-primary/90"
        >
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
