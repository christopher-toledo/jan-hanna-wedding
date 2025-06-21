"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { submitRSVP } from "@/app/actions/rsvp";
import { useActionState } from "react";
import { Heart, Users } from "lucide-react";

interface RSVPFormProps {
  guestId: string;
  guestName: string;
}

interface AdditionalGuest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  rsvpStatus: "pending" | "attending" | "not-attending";
}

export function RSVPForm({ guestId, guestName }: RSVPFormProps) {
  const [state, action, isPending] = useActionState(submitRSVP, null);
  const [attending, setAttending] = useState<string>("");
  const [additionalGuests, setAdditionalGuests] = useState<AdditionalGuest[]>(
    []
  );
  const [selectedAdditionalGuests, setSelectedAdditionalGuests] = useState<
    string[]
  >([]);

  useEffect(() => {
    fetchAdditionalGuests();
  }, [guestId]);

  const fetchAdditionalGuests = async () => {
    try {
      const response = await fetch(
        `/api/admin/additional-guests?primaryGuestId=${guestId}`
      );
      const data = await response.json();
      setAdditionalGuests(data.additionalGuests || []);
    } catch (error) {
      console.error("Error fetching additional guests:", error);
    }
  };

  const handleAdditionalGuestToggle = (guestId: string, attending: boolean) => {
    if (attending) {
      setSelectedAdditionalGuests([...selectedAdditionalGuests, guestId]);
    } else {
      setSelectedAdditionalGuests(
        selectedAdditionalGuests.filter((id) => id !== guestId)
      );
    }
  };

  if (state?.success) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="font-serif text-3xl text-primary mb-4">Thank You!</h3>
        <p className="text-muted-foreground text-lg">
          Your RSVP has been submitted successfully.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          We're excited to celebrate with you!
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-8">
      <input type="hidden" name="guestId" value={guestId} />
      <input type="hidden" name="guestName" value={guestName} />
      <input
        type="hidden"
        name="selectedAdditionalGuests"
        value={JSON.stringify(selectedAdditionalGuests)}
      />

      <div className="space-y-4">
        <Label className="text-lg font-medium text-primary">
          Will you be attending our wedding?
        </Label>
        <RadioGroup
          name="attending"
          value={attending}
          onValueChange={setAttending}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="yes" id="yes" />
            <Label htmlFor="yes" className="text-base cursor-pointer">
              Yes, I'll be there! ✨
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="no" id="no" />
            <Label htmlFor="no" className="text-base cursor-pointer">
              Sorry, I can't make it 💔
            </Label>
          </div>
        </RadioGroup>
      </div>

      {additionalGuests.length > 0 && (
        <Card className="bg-muted/30 elegant-border">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <Label className="text-base font-medium">Additional Guests</Label>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Please select which of your additional guests will be attending:
            </p>
            <div className="space-y-3">
              {additionalGuests.map((guest) => (
                <div
                  key={guest.id}
                  className="flex items-center space-x-3 p-3 border rounded-lg bg-white/50"
                >
                  <Checkbox
                    id={`additional-${guest.id}`}
                    onCheckedChange={(checked) =>
                      handleAdditionalGuestToggle(guest.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`additional-${guest.id}`}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="font-medium">{guest.name}</div>
                    {guest.email && (
                      <div className="text-sm text-muted-foreground">
                        {guest.email}
                      </div>
                    )}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <Label htmlFor="dietaryRestrictions" className="text-base font-medium">
          Dietary Restrictions or Special Requests
        </Label>
        <Textarea
          id="dietaryRestrictions"
          name="dietaryRestrictions"
          placeholder="Please let us know about any dietary restrictions or special requests"
          className="mt-2 min-h-[100px]"
        />
      </div>

      <div>
        <Label htmlFor="message" className="text-base font-medium">
          Message for the Couple (optional)
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Share your excitement or well wishes!"
          className="mt-2 min-h-[100px]"
        />
      </div>

      {state?.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{state.error}</p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-medium elegant-shadow"
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit RSVP"}
      </Button>
    </form>
  );
}
