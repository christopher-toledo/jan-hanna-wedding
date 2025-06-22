"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, Upload, Calendar } from "lucide-react";
import { toast } from "sonner";

interface UploadSettings {
  enabled: boolean;
  maxPhotos: number;
  message?: string;
  scheduleStart?: string;
  scheduleEnd?: string;
}

export function UploadSettingsManager() {
  const [settings, setSettings] = useState<UploadSettings>({
    enabled: true,
    maxPhotos: 5,
    message: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/upload-settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load upload settings");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/upload-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast.success("Upload settings saved successfully");
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save upload settings");
    } finally {
      setSaving(false);
    }
  };

  const formatDateTimeLocal = (dateString?: string) => {
    if (!dateString) return "";
    // Parse the date string as UTC, then convert to UTC+8 for display in input[type="datetime-local"]
    const date = new Date(dateString);
    // Add 8 hours to UTC time
    date.setHours(date.getUTCHours() + 8);
    // Format as yyyy-MM-ddTHH:mm (local time for UTC+8)
    const pad = (n: number) => n.toString().padStart(2, "0");
    const yyyy = date.getFullYear();
    const MM = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const HH = pad(date.getHours());
    const mm = pad(date.getMinutes());

    const formattedDate = `${yyyy}-${MM}-${dd}T${HH}:${mm}`;
    console.log(formattedDate);
    return `${yyyy}-${MM}-${dd}T${HH}:${mm}`;
  };

  const handleDateTimeChange = (
    field: "scheduleStart" | "scheduleEnd",
    value: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value ? formatDateTimeLocal(value) : undefined,
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Photo Upload Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Upload */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="upload-enabled" className="text-base font-medium">
              Enable Photo Uploads
            </Label>
            <p className="text-sm text-muted-foreground">
              Allow guests to upload photos to the gallery
            </p>
          </div>
          <Switch
            id="upload-enabled"
            checked={settings.enabled}
            onCheckedChange={(checked) =>
              setSettings((prev) => ({ ...prev, enabled: checked }))
            }
          />
        </div>

        {/* Max Photos Limit */}
        <div className="space-y-2">
          <Label htmlFor="max-photos" className="text-base font-medium">
            Maximum Photos Per Upload
          </Label>
          <Input
            id="max-photos"
            type="number"
            min="1"
            max="20"
            value={settings.maxPhotos}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                maxPhotos: Number.parseInt(e.target.value) || 5,
              }))
            }
            className="w-32"
          />
          <p className="text-sm text-muted-foreground">
            Guests can upload 1-20 photos at a time
          </p>
        </div>

        {/* Custom Message */}
        <div className="space-y-2">
          <Label htmlFor="custom-message" className="text-base font-medium">
            Custom Message (Optional)
          </Label>
          <Textarea
            id="custom-message"
            placeholder="Enter a custom message to display when uploads are disabled..."
            value={settings.message || ""}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, message: e.target.value }))
            }
            rows={3}
          />
          <p className="text-sm text-muted-foreground">
            This message will be shown when uploads are disabled
          </p>
        </div>

        {/* Schedule Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <Label className="text-base font-medium">
              Schedule Upload Window (Optional)
            </Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="schedule-start" className="text-sm font-medium">
                Start Date & Time
              </Label>
              <Input
                id="schedule-start"
                type="datetime-local"
                value={formatDateTimeLocal(settings.scheduleStart)}
                onChange={(e) =>
                  handleDateTimeChange("scheduleStart", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="schedule-end" className="text-sm font-medium">
                End Date & Time
              </Label>
              <Input
                id="schedule-end"
                type="datetime-local"
                value={formatDateTimeLocal(settings.scheduleEnd)}
                onChange={(e) =>
                  handleDateTimeChange("scheduleEnd", e.target.value)
                }
              />
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            If set, uploads will only be enabled during this time window. Leave
            empty to allow uploads anytime when enabled.
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button onClick={saveSettings} disabled={saving} className="min-w-32">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
