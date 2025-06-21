"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { submitRSVP } from "@/app/actions/rsvp";
import { useActionState } from "react";
import { Heart, Plus, Trash2 } from "lucide-react";

interface RSVPFormProps {
  guestId: string;
  guestName: string;
}

interface AdditionalGuest {
  id: string;
  name: string;
  email: string;
}

export function RSVPForm({ guestId, guestName }: RSVPFormProps) {
  const [state, action, isPending] = useActionState(submitRSVP, null);
  const [attending, setAttending] = useState<string>("");
  const [bringingGuests, setBringingGuests] = useState(false);
  const [additionalGuests, setAdditionalGuests] = useState<AdditionalGuest[]>(
    []
  );

  const addGuest = () => {
    const newGuest: AdditionalGuest = {
      id: Date.now().toString(),
      name: "",
      email: "",
    };
    setAdditionalGuests([...additionalGuests, newGuest]);
  };

  const removeGuest = (id: string) => {
    setAdditionalGuests(additionalGuests.filter((guest) => guest.id !== id));
  };

  const updateGuest = (id: string, field: "name" | "email", value: string) => {
    setAdditionalGuests(
      additionalGuests.map((guest) =>
        guest.id === id ? { ...guest, [field]: value } : guest
      )
    );
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
        name="additionalGuests"
        value={JSON.stringify(additionalGuests)}
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

      {attending === "yes" && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center space-x-3 p-4 border rounded-lg">
            <Checkbox
              id="bringingGuests"
              name="bringingGuests"
              checked={bringingGuests}
              onCheckedChange={(checked: boolean) => {
                setBringingGuests(checked as boolean);
                if (!checked) {
                  setAdditionalGuests([]);
                }
              }}
            />
            <Label
              htmlFor="bringingGuests"
              className="text-base cursor-pointer"
            >
              I'll be bringing additional guests
            </Label>
          </div>

          {bringingGuests && (
            <Card className="bg-muted/30 elegant-border animate-fade-in">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-base font-medium">
                    Additional Guests
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addGuest}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Guest
                  </Button>
                </div>

                {additionalGuests.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Click "Add Guest" to add your additional guests
                  </p>
                )}

                {additionalGuests.map((guest, index) => (
                  <div
                    key={guest.id}
                    className="space-y-3 p-4 border rounded-lg bg-white/50"
                  >
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        Guest {index + 1}
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeGuest(guest.id)}
                        className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label
                          htmlFor={`guest-name-${guest.id}`}
                          className="text-sm"
                        >
                          Full Name *
                        </Label>
                        <Input
                          id={`guest-name-${guest.id}`}
                          value={guest.name}
                          onChange={(e) =>
                            updateGuest(guest.id, "name", e.target.value)
                          }
                          placeholder="Enter guest name"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor={`guest-email-${guest.id}`}
                          className="text-sm"
                        >
                          Email (optional)
                        </Label>
                        <Input
                          id={`guest-email-${guest.id}`}
                          type="email"
                          value={guest.email}
                          onChange={(e) =>
                            updateGuest(guest.id, "email", e.target.value)
                          }
                          placeholder="Enter guest email"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <div>
            <Label
              htmlFor="dietaryRestrictions"
              className="text-base font-medium"
            >
              Dietary Restrictions or Special Requests
            </Label>
            <Textarea
              id="dietaryRestrictions"
              name="dietaryRestrictions"
              placeholder="Please let us know about any dietary restrictions or special requests for you and your guests"
              className="mt-2 min-h-[100px]"
            />
          </div>
        </div>
      )}

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
        disabled={isPending || !attending}
      >
        {isPending ? "Submitting..." : "Submit RSVP"}
      </Button>
    </form>
  );
}
