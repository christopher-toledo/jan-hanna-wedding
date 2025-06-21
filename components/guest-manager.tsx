"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Copy,
  Trash2,
  Mail,
  Phone,
  ExternalLink,
  Check,
  Filter,
  Users,
  Edit,
  UserPlus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Guest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  rsvpStatus: "pending" | "attending" | "not-attending";
  createdAt: string;
}

interface RSVPResponse {
  id: string;
  guestId: string;
  guestName: string;
  attending: "yes" | "no";
  additionalGuests: Array<{
    name: string;
    email: string;
  }>;
  submittedAt: string;
}

type FilterStatus = "all" | "pending" | "attending" | "not-attending";

export function GuestManager() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rsvps, setRsvps] = useState<RSVPResponse[]>([]);
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterGuests();
  }, [guests, filterStatus, searchTerm]);

  const fetchData = async () => {
    try {
      const [guestsResponse, rsvpsResponse] = await Promise.all([
        fetch("/api/admin/guests"),
        fetch("/api/admin/rsvps"),
      ]);

      const guestsData = await guestsResponse.json();
      const rsvpsData = await rsvpsResponse.json();

      setGuests(guestsData.guests || []);
      setRsvps(rsvpsData.rsvps || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterGuests = () => {
    let filtered = guests;

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((guest) => guest.rsvpStatus === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (guest) =>
          guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          guest.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredGuests(filtered);
  };

  const getAdditionalGuestCount = (guestId: string) => {
    const rsvp = rsvps.find((r) => r.guestId === guestId);
    return rsvp?.additionalGuests?.length || 0;
  };

  const handleAddGuest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;

    try {
      const response = await fetch("/api/admin/guests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone }),
      });

      const result = await response.json();

      if (result.success) {
        setIsAddDialogOpen(false);
        fetchData();
        // Reset form
        //e.currentTarget.reset();
      } else {
        alert(result.error || "Failed to add guest");
      }
    } catch (error) {
      console.error("Error adding guest:", error);
      alert("Failed to add guest");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditGuest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingGuest) return;

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;

    try {
      const response = await fetch(`/api/admin/guests/${editingGuest.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone }),
      });

      const result = await response.json();

      if (result.success) {
        setEditingGuest(null);
        fetchData();
      } else {
        alert(result.error || "Failed to update guest");
      }
    } catch (error) {
      console.error("Error updating guest:", error);
      alert("Failed to update guest");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGuest = async (guestId: string, guestName: string) => {
    const additionalCount = getAdditionalGuestCount(guestId);
    const message =
      additionalCount > 0
        ? `Are you sure you want to delete ${guestName}? This will also delete their RSVP response and ${additionalCount} additional guest(s).`
        : `Are you sure you want to delete ${guestName}? This will also delete their RSVP response if it exists.`;

    if (confirm(message)) {
      try {
        const response = await fetch(`/api/admin/guests/${guestId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchData();
        } else {
          alert("Failed to delete guest");
        }
      } catch (error) {
        console.error("Error deleting guest:", error);
        alert("Failed to delete guest");
      }
    }
  };

  const copyRSVPLink = async (guestId: string) => {
    const link = `${window.location.origin}/rsvp/${guestId}`;
    await navigator.clipboard.writeText(link);
    setCopiedLink(guestId);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "attending":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Attending
          </Badge>
        );
      case "not-attending":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Not Attending
          </Badge>
        );
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getStatusCount = (status: FilterStatus) => {
    if (status === "all") return guests.length;
    return guests.filter((guest) => guest.rsvpStatus === status).length;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="elegant-shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Guest Management
          <Badge variant="secondary">{guests.length} total</Badge>
        </CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Guest
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Guest</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddGuest} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter guest name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter phone number"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Guest"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Filter by Status:</Label>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All", count: getStatusCount("all") },
              {
                key: "pending",
                label: "Pending",
                count: getStatusCount("pending"),
              },
              {
                key: "attending",
                label: "Attending",
                count: getStatusCount("attending"),
              },
              {
                key: "not-attending",
                label: "Not Attending",
                count: getStatusCount("not-attending"),
              },
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={filterStatus === filter.key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(filter.key as FilterStatus)}
                className="flex items-center gap-2"
              >
                {filter.label}
                <Badge variant="secondary" className="text-xs">
                  {filter.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div>
          <Label htmlFor="search" className="text-sm font-medium">
            Search Guests:
          </Label>
          <Input
            id="search"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-2"
          />
        </div>

        {/* Guest List */}
        {filteredGuests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {guests.length === 0
                ? "No guests added yet. Add your first guest to get started."
                : "No guests match your current filters."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredGuests.map((guest) => {
              const additionalCount = getAdditionalGuestCount(guest.id);
              return (
                <div
                  key={guest.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-lg">{guest.name}</h3>
                      {getStatusBadge(guest.rsvpStatus)}
                      {additionalCount > 0 && (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <UserPlus className="h-3 w-3" />+{additionalCount}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {guest.email}
                      </div>
                      {guest.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {guest.phone}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyRSVPLink(guest.id)}
                      className="flex items-center gap-1"
                    >
                      {copiedLink === guest.id ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      {copiedLink === guest.id ? "Copied!" : "Copy Link"}
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={`/rsvp/${guest.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingGuest(guest)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteGuest(guest.id, guest.name)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {/* Edit Guest Dialog */}
      <Dialog open={!!editingGuest} onOpenChange={() => setEditingGuest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Guest Details</DialogTitle>
          </DialogHeader>
          {editingGuest && (
            <form onSubmit={handleEditGuest} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  defaultValue={editingGuest.name}
                  placeholder="Enter guest name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email Address</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  defaultValue={editingGuest.email}
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone Number (Optional)</Label>
                <Input
                  id="edit-phone"
                  name="phone"
                  type="tel"
                  defaultValue={editingGuest.phone || ""}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Guest"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingGuest(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
