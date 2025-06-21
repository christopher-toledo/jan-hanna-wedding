"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  QrCode,
  Download,
  Send,
  UserCheck,
  Clock,
  UserX,
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
  invitationSent: boolean;
  createdAt: string;
}

interface AdditionalGuest {
  id: string;
  primaryGuestId: string;
  name: string;
  email?: string;
  phone?: string;
  rsvpStatus: "pending" | "attending" | "not-attending";
  createdAt: string;
}

type FilterStatus = "all" | "pending" | "attending" | "not-attending";

export function GuestManager() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [additionalGuests, setAdditionalGuests] = useState<AdditionalGuest[]>(
    []
  );
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([]);
  const [filteredAdditionalGuests, setFilteredAdditionalGuests] = useState<
    AdditionalGuest[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [editingAdditionalGuest, setEditingAdditionalGuest] =
    useState<AdditionalGuest | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [additionalFilterStatus, setAdditionalFilterStatus] =
    useState<FilterStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [additionalSearchTerm, setAdditionalSearchTerm] = useState("");
  const [qrCodeData, setQrCodeData] = useState<{
    qrCodeUrl: string;
    rsvpUrl: string;
  } | null>(null);
  const [tempAdditionalGuests, setTempAdditionalGuests] = useState<
    Array<{ name: string; email: string; phone: string }>
  >([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterGuests();
  }, [guests, filterStatus, searchTerm]);

  useEffect(() => {
    filterAdditionalGuests();
  }, [additionalGuests, additionalFilterStatus, additionalSearchTerm]);

  const fetchData = async () => {
    try {
      const [guestsResponse, additionalGuestsResponse] = await Promise.all([
        fetch("/api/admin/guests"),
        fetch("/api/admin/additional-guests"),
      ]);

      const guestsData = await guestsResponse.json();
      const additionalGuestsData = await additionalGuestsResponse.json();

      setGuests(guestsData.guests || []);
      setAdditionalGuests(additionalGuestsData.additionalGuests || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterGuests = () => {
    let filtered = guests;

    if (filterStatus !== "all") {
      filtered = filtered.filter((guest) => guest.rsvpStatus === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (guest) =>
          guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          guest.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredGuests(filtered);
  };

  const filterAdditionalGuests = () => {
    let filtered = additionalGuests;

    if (additionalFilterStatus !== "all") {
      filtered = filtered.filter(
        (guest) => guest.rsvpStatus === additionalFilterStatus
      );
    }

    if (additionalSearchTerm) {
      filtered = filtered.filter(
        (guest) =>
          guest.name
            .toLowerCase()
            .includes(additionalSearchTerm.toLowerCase()) ||
          (guest.email &&
            guest.email
              .toLowerCase()
              .includes(additionalSearchTerm.toLowerCase()))
      );
    }

    setFilteredAdditionalGuests(filtered);
  };

  const getAdditionalGuestCount = (primaryGuestId: string) => {
    return additionalGuests.filter(
      (guest) => guest.primaryGuestId === primaryGuestId
    ).length;
  };

  const getPrimaryGuestName = (primaryGuestId: string) => {
    const primaryGuest = guests.find((guest) => guest.id === primaryGuestId);
    return primaryGuest?.name || "Unknown";
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
        body: JSON.stringify({
          name,
          email,
          phone,
          additionalGuests: tempAdditionalGuests,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsAddDialogOpen(false);
        setTempAdditionalGuests([]);
        fetchData();
        e.currentTarget.reset();
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

  const handleEditAdditionalGuest = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!editingAdditionalGuest) return;

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;

    try {
      const response = await fetch(
        `/api/admin/additional-guests/${editingAdditionalGuest.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, phone }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setEditingAdditionalGuest(null);
        fetchData();
      } else {
        alert(result.error || "Failed to update additional guest");
      }
    } catch (error) {
      console.error("Error updating additional guest:", error);
      alert("Failed to update additional guest");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGuest = async (guestId: string, guestName: string) => {
    const additionalCount = getAdditionalGuestCount(guestId);
    const message =
      additionalCount > 0
        ? `Are you sure you want to delete ${guestName}? This will also delete ${additionalCount} additional guest(s).`
        : `Are you sure you want to delete ${guestName}?`;

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

  const handleDeleteAdditionalGuest = async (
    guestId: string,
    guestName: string
  ) => {
    if (confirm(`Are you sure you want to delete ${guestName}?`)) {
      try {
        const response = await fetch(
          `/api/admin/additional-guests/${guestId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          fetchData();
        } else {
          alert("Failed to delete additional guest");
        }
      } catch (error) {
        console.error("Error deleting additional guest:", error);
        alert("Failed to delete additional guest");
      }
    }
  };

  const handleToggleInvitationSent = async (
    guestId: string,
    currentStatus: boolean
  ) => {
    try {
      const response = await fetch(`/api/admin/guests/${guestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ invitationSent: !currentStatus }),
      });

      if (response.ok) {
        fetchData();
      } else {
        alert("Failed to update invitation status");
      }
    } catch (error) {
      console.error("Error updating invitation status:", error);
      alert("Failed to update invitation status");
    }
  };

  const generateQRCode = async (guestId: string) => {
    try {
      const baseUrl = window.location.origin;
      const response = await fetch(
        `/api/admin/guests/${guestId}/qr?baseUrl=${encodeURIComponent(baseUrl)}`
      );
      const data = await response.json();
      setQrCodeData(data);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const copyRSVPLink = async (guestId: string) => {
    const link = `${window.location.origin}/rsvp/${guestId}`;
    await navigator.clipboard.writeText(link);
    setCopiedLink(guestId);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const exportGuestList = () => {
    const allGuests = [
      ...guests.map((guest) => ({
        Type: "Primary",
        Name: guest.name,
        Email: guest.email,
        Phone: guest.phone || "",
        "RSVP Status": guest.rsvpStatus,
        "Invitation Sent": guest.invitationSent ? "Yes" : "No",
        "Primary Guest": "",
        "Created At": new Date(guest.createdAt).toLocaleDateString(),
      })),
      ...additionalGuests.map((guest) => ({
        Type: "Additional",
        Name: guest.name,
        Email: guest.email || "",
        Phone: guest.phone || "",
        "RSVP Status": guest.rsvpStatus,
        "Invitation Sent": "",
        "Primary Guest": getPrimaryGuestName(guest.primaryGuestId),
        "Created At": new Date(guest.createdAt).toLocaleDateString(),
      })),
    ];

    const headers = Object.keys(allGuests[0]);
    const csvContent = [
      headers.join(","),
      ...allGuests.map((guest) =>
        headers
          .map((header) => `"${guest[header as keyof typeof guest]}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wedding-guest-list-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const addTempAdditionalGuest = () => {
    setTempAdditionalGuests([
      ...tempAdditionalGuests,
      { name: "", email: "", phone: "" },
    ]);
  };

  const removeTempAdditionalGuest = (index: number) => {
    setTempAdditionalGuests(tempAdditionalGuests.filter((_, i) => i !== index));
  };

  const updateTempAdditionalGuest = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...tempAdditionalGuests];
    updated[index] = { ...updated[index], [field]: value };
    setTempAdditionalGuests(updated);
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

  const getStatusCount = (status: FilterStatus, isAdditional = false) => {
    const targetGuests = isAdditional ? additionalGuests : guests;
    if (status === "all") return targetGuests.length;
    return targetGuests.filter((guest) => guest.rsvpStatus === status).length;
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Guest Management</h2>
          <p className="text-muted-foreground">
            Manage primary and additional guests
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportGuestList} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Primary Guest
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Primary Guest</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddGuest} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter guest name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
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

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-medium">
                      Additional Guests
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTempAdditionalGuest}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Additional Guest
                    </Button>
                  </div>

                  {tempAdditionalGuests.map((guest, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <Label className="font-medium">
                          Additional Guest {index + 1}
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTempAdditionalGuest(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <Label>Name *</Label>
                          <Input
                            value={guest.name}
                            onChange={(e) =>
                              updateTempAdditionalGuest(
                                index,
                                "name",
                                e.target.value
                              )
                            }
                            placeholder="Guest name"
                            required
                          />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={guest.email}
                            onChange={(e) =>
                              updateTempAdditionalGuest(
                                index,
                                "email",
                                e.target.value
                              )
                            }
                            placeholder="Guest email"
                          />
                        </div>
                        <div>
                          <Label>Phone</Label>
                          <Input
                            value={guest.phone}
                            onChange={(e) =>
                              updateTempAdditionalGuest(
                                index,
                                "phone",
                                e.target.value
                              )
                            }
                            placeholder="Guest phone"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Guest"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="primary" className="space-y-6">
        <TabsList>
          <TabsTrigger value="primary" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Primary Guests ({guests.length})
          </TabsTrigger>
          <TabsTrigger value="additional" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Additional Guests ({additionalGuests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="primary">
          <Card className="elegant-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Primary Guests
                <Badge variant="secondary">{guests.length} total</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Guest Filters */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm font-medium">
                    Filter by Status:
                  </Label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      key: "all",
                      label: "All",
                      count: getStatusCount("all"),
                      icon: Users,
                    },
                    {
                      key: "pending",
                      label: "Pending",
                      count: getStatusCount("pending"),
                      icon: Clock,
                    },
                    {
                      key: "attending",
                      label: "Attending",
                      count: getStatusCount("attending"),
                      icon: UserCheck,
                    },
                    {
                      key: "not-attending",
                      label: "Not Attending",
                      count: getStatusCount("not-attending"),
                      icon: UserX,
                    },
                  ].map((filter) => (
                    <Button
                      key={filter.key}
                      variant={
                        filterStatus === filter.key ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        setFilterStatus(filter.key as FilterStatus)
                      }
                      className="flex items-center gap-2"
                    >
                      <filter.icon className="h-3 w-3" />
                      {filter.label}
                      <Badge variant="secondary" className="text-xs">
                        {filter.count}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="search" className="text-sm font-medium">
                  Search Primary Guests:
                </Label>
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-2"
                />
              </div>

              {/* Primary Guest List */}
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
                            <h3 className="font-medium text-lg">
                              {guest.name}
                            </h3>
                            {getStatusBadge(guest.rsvpStatus)}
                            {additionalCount > 0 && (
                              <Badge
                                variant="outline"
                                className="flex items-center gap-1"
                              >
                                <UserPlus className="h-3 w-3" />+
                                {additionalCount}
                              </Badge>
                            )}
                            {guest.invitationSent && (
                              <Badge
                                variant="outline"
                                className="flex items-center gap-1 bg-blue-50 text-blue-700"
                              >
                                <Send className="h-3 w-3" />
                                Sent
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
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`invitation-${guest.id}`}
                              checked={guest.invitationSent}
                              onCheckedChange={() =>
                                handleToggleInvitationSent(
                                  guest.id,
                                  guest.invitationSent
                                )
                              }
                            />
                            <Label
                              htmlFor={`invitation-${guest.id}`}
                              className="text-xs"
                            >
                              Invitation Sent
                            </Label>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => generateQRCode(guest.id)}
                          >
                            <QrCode className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyRSVPLink(guest.id)}
                          >
                            {copiedLink === guest.id ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
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
                            onClick={() =>
                              handleDeleteGuest(guest.id, guest.name)
                            }
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
          </Card>
        </TabsContent>

        <TabsContent value="additional">
          <Card className="elegant-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Additional Guests
                <Badge variant="secondary">
                  {additionalGuests.length} total
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Additional Guest Filters */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm font-medium">
                    Filter by Status:
                  </Label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      key: "all",
                      label: "All",
                      count: getStatusCount("all", true),
                      icon: Users,
                    },
                    {
                      key: "pending",
                      label: "Pending",
                      count: getStatusCount("pending", true),
                      icon: Clock,
                    },
                    {
                      key: "attending",
                      label: "Attending",
                      count: getStatusCount("attending", true),
                      icon: UserCheck,
                    },
                    {
                      key: "not-attending",
                      label: "Not Attending",
                      count: getStatusCount("not-attending", true),
                      icon: UserX,
                    },
                  ].map((filter) => (
                    <Button
                      key={filter.key}
                      variant={
                        additionalFilterStatus === filter.key
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        setAdditionalFilterStatus(filter.key as FilterStatus)
                      }
                      className="flex items-center gap-2"
                    >
                      <filter.icon className="h-3 w-3" />
                      {filter.label}
                      <Badge variant="secondary" className="text-xs">
                        {filter.count}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label
                  htmlFor="additional-search"
                  className="text-sm font-medium"
                >
                  Search Additional Guests:
                </Label>
                <Input
                  id="additional-search"
                  placeholder="Search by name or email..."
                  value={additionalSearchTerm}
                  onChange={(e) => setAdditionalSearchTerm(e.target.value)}
                  className="mt-2"
                />
              </div>

              {/* Additional Guest List */}
              {filteredAdditionalGuests.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {additionalGuests.length === 0
                      ? "No additional guests added yet."
                      : "No additional guests match your current filters."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAdditionalGuests.map((guest) => (
                    <div
                      key={guest.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-lg">{guest.name}</h3>
                          {getStatusBadge(guest.rsvpStatus)}
                          <Badge variant="outline" className="text-xs">
                            Guest of:{" "}
                            {getPrimaryGuestName(guest.primaryGuestId)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {guest.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {guest.email}
                            </div>
                          )}
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
                          onClick={() => setEditingAdditionalGuest(guest)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDeleteAdditionalGuest(guest.id, guest.name)
                          }
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Primary Guest Dialog */}
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

      {/* Edit Additional Guest Dialog */}
      <Dialog
        open={!!editingAdditionalGuest}
        onOpenChange={() => setEditingAdditionalGuest(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Additional Guest Details</DialogTitle>
          </DialogHeader>
          {editingAdditionalGuest && (
            <form onSubmit={handleEditAdditionalGuest} className="space-y-4">
              <div>
                <Label htmlFor="edit-additional-name">Full Name</Label>
                <Input
                  id="edit-additional-name"
                  name="name"
                  defaultValue={editingAdditionalGuest.name}
                  placeholder="Enter guest name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-additional-email">Email Address</Label>
                <Input
                  id="edit-additional-email"
                  name="email"
                  type="email"
                  defaultValue={editingAdditionalGuest.email || ""}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="edit-additional-phone">Phone Number</Label>
                <Input
                  id="edit-additional-phone"
                  name="phone"
                  type="tel"
                  defaultValue={editingAdditionalGuest.phone || ""}
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
                  onClick={() => setEditingAdditionalGuest(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={!!qrCodeData} onOpenChange={() => setQrCodeData(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>RSVP QR Code</DialogTitle>
          </DialogHeader>
          {qrCodeData && (
            <div className="text-center space-y-4">
              <img
                src={qrCodeData.qrCodeUrl || "/placeholder.svg"}
                alt="QR Code"
                className="mx-auto"
              />
              <p className="text-sm text-muted-foreground">
                Scan this QR code to access the RSVP page
              </p>
              <p className="text-xs text-muted-foreground break-all">
                {qrCodeData.rsvpUrl}
              </p>
              <Button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = qrCodeData.qrCodeUrl;
                  link.download = "rsvp-qr-code.png";
                  link.click();
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download QR Code
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
