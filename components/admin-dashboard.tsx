"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminStats } from "./admin-stats";
import { GuestManager } from "./guest-manager";
import { RSVPResponses } from "./rsvp-responses";
import { GalleryManager } from "./gallery-manager";
import { UploadSettingsManager } from "./upload-settings-manager";
import { GalleryPreviewManager } from "./gallery-preview-manager";
import {
  Users,
  MessageSquare,
  BarChart3,
  Camera,
  Settings,
  Eye,
} from "lucide-react";

export function AdminDashboard() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-primary mb-2">Wedding Admin</h1>
        <p className="text-muted-foreground">
          Manage your wedding guests, RSVPs, and gallery
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="guests" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Guests
          </TabsTrigger>
          <TabsTrigger value="rsvps" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            RSVPs
          </TabsTrigger>
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Gallery
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AdminStats />
        </TabsContent>

        <TabsContent value="guests">
          <GuestManager />
        </TabsContent>

        <TabsContent value="rsvps">
          <RSVPResponses />
        </TabsContent>

        <TabsContent value="gallery">
          <GalleryManager />
        </TabsContent>

        <TabsContent value="preview">
          <GalleryPreviewManager />
        </TabsContent>

        <TabsContent value="settings">
          <UploadSettingsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
