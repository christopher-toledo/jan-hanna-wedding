"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Users, Calendar, MessageSquare, Utensils } from "lucide-react";

interface RSVPResponse {
  id: string;
  guestId: string;
  guestName: string;
  attending: "yes" | "no";
  additionalGuests: Array<{
    name: string;
    email: string;
  }>;
  dietaryRestrictions?: string;
  message?: string;
  submittedAt: string;
}

export function RSVPResponses() {
  const [responses, setResponses] = useState<RSVPResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      const response = await fetch("/api/admin/rsvps");
      const data = await response.json();
      setResponses(data.rsvps || []);
    } catch (error) {
      console.error("Error fetching RSVP responses:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (attending: string) => {
    return attending === "yes" ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        Attending
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        Not Attending
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="elegant-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          RSVP Responses
          <Badge variant="secondary">{responses.length} responses</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {responses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No RSVP responses yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {responses.map((response, key) => (
              <div
                key={response.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium">{response.guestName}</h3>
                    {getStatusBadge(response.attending)}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(response.submittedAt).toLocaleDateString()}
                  </div>
                </div>

                {/* {response.additionalGuests &&
                  response.additionalGuests.length > 0 && (
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Additional Guests ({response.additionalGuests.length})
                        </span>
                      </div>
                      <div className="space-y-1">
                        {response.additionalGuests.map((guest, index) => (
                          <div
                            key={index}
                            className="text-sm text-muted-foreground"
                          >
                            • {guest.name} {guest.email && `(${guest.email})`}
                          </div>
                        ))}
                      </div>
                    </div>
                  )} */}

                {response.dietaryRestrictions && (
                  <div className="flex items-start gap-2">
                    <Utensils className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="text-sm font-medium">
                        Dietary Restrictions:
                      </span>
                      <p className="text-sm text-muted-foreground">
                        {response.dietaryRestrictions}
                      </p>
                    </div>
                  </div>
                )}

                {response.message && (
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="text-sm font-medium">Message:</span>
                      <p className="text-sm text-muted-foreground italic">
                        "{response.message}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
