"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { submitRSVP } from "@/app/actions/rsvp";
import { useActionState } from "react";
import {
  Heart,
  Users,
  Mail,
  AlertCircle,
  Info,
  Clock,
  Edit,
  Circle,
  Phone,
} from "lucide-react";
import React from "react";
import { InputWithIcon } from "@/components/ui/input-with-icon";

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

interface RSVPSettings {
  enabled: boolean;
  deadline?: string;
  customMessage?: string;
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
  const [additionalGuestDetails, setAdditionalGuestDetails] = useState<
    Record<string, { email: string; phone: string }>
  >({});
  const [primaryGuestEmail, setPrimaryGuestEmail] = useState("");
  const [primaryGuestPhone, setPrimaryGuestPhone] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rsvpSettings, setRsvpSettings] = useState<RSVPSettings | null>(null);
  const [isRsvpOpen, setIsRsvpOpen] = useState(true);
  const [hasExistingRsvp, setHasExistingRsvp] = useState(false);

  // Refs for focusing on error fields
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const attendingRef = useRef<HTMLDivElement>(null);

  // Check if phone is required based on attendance
  const isPhoneRequired = attending === "yes";

  useEffect(() => {
    fetchRsvpSettings();
    fetchGuestData();
    fetchAdditionalGuests();
    fetchExistingRSVP();
  }, [guestId]);

  // Handle form submission errors and focus on first error field
  useEffect(() => {
    if (state?.error && !isPending) {
      setIsSubmitting(false);

      // Focus on the first field with an error
      if (errors.primaryPhone && phoneRef.current) {
        phoneRef.current.focus();
        phoneRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else if (errors.attending && attendingRef.current) {
        attendingRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [state, errors, isPending]);

  const fetchRsvpSettings = async () => {
    try {
      const response = await fetch("/api/admin/rsvp-settings");
      const data = await response.json();
      setRsvpSettings(data.settings);
      setIsRsvpOpen(data.isOpen);
    } catch (error) {
      console.error("Error fetching RSVP settings:", error);
    }
  };

  const fetchGuestData = async () => {
    try {
      const response = await fetch(`/api/admin/guests`);
      const data = await response.json();
      const guest = data.guests?.find((g: any) => g.id === guestId);
      if (guest) {
        setPrimaryGuestEmail(guest.email || "");
        setPrimaryGuestPhone(guest.phone || "");
      }
    } catch (error) {
      console.error("Error fetching guest data:", error);
    }
  };

  const fetchExistingRSVP = async () => {
    try {
      const response = await fetch(`/api/admin/rsvps`);
      const data = await response.json();
      const existingRSVP = data.rsvps?.find(
        (rsvp: RSVPResponse) => rsvp.guestId === guestId
      );

      if (existingRSVP) {
        setHasExistingRsvp(true);
        setAttending(existingRSVP.attending);
        setDietaryRestrictions(existingRSVP.dietaryRestrictions || "");
        setMessage(existingRSVP.message || "");
      }
    } catch (error) {
      console.error("Error fetching existing RSVP:", error);
    }
  };

  const fetchAdditionalGuests = async () => {
    try {
      const response = await fetch(
        `/api/admin/additional-guests?primaryGuestId=${guestId}`
      );
      const data = await response.json();
      setAdditionalGuests(data.additionalGuests || []);

      // Pre-select additional guests who are already attending
      const attendingGuests = (data.additionalGuests || [])
        .filter((guest: AdditionalGuest) => guest.rsvpStatus === "attending")
        .map((guest: AdditionalGuest) => guest.id);
      setSelectedAdditionalGuests(attendingGuests);

      // Initialize additional guest details
      const details: Record<string, { email: string; phone: string }> = {};
      data.additionalGuests?.forEach((guest: AdditionalGuest) => {
        details[guest.id] = {
          email: guest.email || "",
          phone: guest.phone || "",
        };
      });
      setAdditionalGuestDetails(details);
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

  const updateAdditionalGuestDetail = (
    guestId: string,
    field: "email" | "phone",
    value: string
  ) => {
    setAdditionalGuestDetails((prev) => ({
      ...prev,
      [guestId]: {
        ...prev[guestId],
        [field]: value,
      },
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate attending selection
    if (!attending) {
      newErrors.attending = "Please select whether you will be attending";
    }

    // Only validate phone if attending "yes"
    if (attending === "yes" && !primaryGuestPhone.trim()) {
      newErrors.primaryPhone = "Phone number is required when attending";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getDeadlineDisplay = () => {
    if (!rsvpSettings?.deadline) return "August 31, 2025";

    const deadlineDate = new Date(rsvpSettings.deadline);

    return deadlineDate.toLocaleString("en-PH", {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleRSVPChoice = (value: string) => {
    setAttending(value);
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (newErrors.attending) delete newErrors.attending;
      if (newErrors.primaryPhone) delete newErrors.primaryPhone;
      return newErrors;
    });
  };

  // If RSVP is closed, show closed message
  if (!isRsvpOpen) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="h-10 w-10 text-red-600" />
        </div>
        <h3 className="font-serif text-3xl text-primary mb-4">RSVP Closed</h3>
        <p className="text-muted-foreground text-lg mb-4">
          {rsvpSettings?.customMessage ||
            "RSVP submissions are currently closed."}
        </p>
        {rsvpSettings?.deadline && (
          <p className="text-sm text-muted-foreground">
            The deadline was {getDeadlineDisplay()}
          </p>
        )}
      </div>
    );
  }

  if (state?.success) {
    return (
      <div className="text-center py-12">
        <h3 className="font-serif text-3xl md:text-4xl text-black mb-4">
          Thank You!
        </h3>
        <p className="font-cormorant text-black text-xl md:text-2xl">
          Your RSVP has been {hasExistingRsvp ? "updated" : "submitted"}{" "}
          successfully.
        </p>
        <p className="font-cormorant text-black text-lg md:text-xl mt-2">
          {attending === "yes"
            ? "We're excited to celebrate with you!"
            : "Thank you for letting us know. We'll miss you!"}
        </p>
      </div>
    );
  }

  // Enhanced form action that includes all data
  const enhancedAction = (formData: FormData) => {
    setIsSubmitting(true);

    // Validate form before submission
    if (!validateForm()) {
      setIsSubmitting(false);

      // Focus on the first field with an error after a short delay
      setTimeout(() => {
        if (errors.primaryPhone && phoneRef.current) {
          phoneRef.current.focus();
          phoneRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        } else if (errors.attending && attendingRef.current) {
          attendingRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);

      return;
    }

    // Add primary guest contact info
    formData.append("primaryGuestEmail", primaryGuestEmail);
    formData.append("primaryGuestPhone", primaryGuestPhone);

    // Add selected additional guests
    formData.append(
      "selectedAdditionalGuests",
      JSON.stringify(selectedAdditionalGuests)
    );

    // Add additional guest details for selected guests
    const selectedGuestDetails = selectedAdditionalGuests.map((guestId) => ({
      id: guestId,
      email: additionalGuestDetails[guestId]?.email || "",
      phone: additionalGuestDetails[guestId]?.phone || "",
    }));
    formData.append(
      "additionalGuestDetails",
      JSON.stringify(selectedGuestDetails)
    );

    // Call the original action
    return action(formData);
  };

  // RSVP Option Button Component
  function RSVPOption({
    id,
    label,
    selected,
    onClick,
    error,
    highlight,
  }: {
    id: string;
    label: string;
    selected: boolean;
    onClick: () => void;
    error?: boolean;
    highlight?: string;
  }) {
    return (
      <div
        id={`${id}-option`}
        onClick={onClick}
        className={`cursor-pointer flex-1 max-w-xs flex items-center space-x-3 p-2 border rounded-lg transition-colors justify-center hover:bg-darkGrayBlue/5
        ${error ? "border-red-500" : ""}
        ${
          selected
            ? `ring-2 ring-darkGrayBlue border-darkGrayBlue ${highlight}`
            : ""
        }
      `}
      >
        <div className="flex items-center justify-center h-4 w-4">
          <div className="aspect-square h-4 w-4 rounded-full border border-darkGrayBlue flex items-center justify-center">
            {selected && (
              <Circle className="h-2.5 w-2.5 fill-darkGrayBlue text-darkGrayBlue" />
            )}
          </div>
        </div>
        <Label
          htmlFor={id}
          className="text-xl cursor-pointer font-cormorant text-black"
        >
          {label}
        </Label>
      </div>
    );
  }

  // Reusable YesNoRadioButton component
  function YesNoRadioButton({
    id,
    name,
    checked,
    value,
    label,
    onChange,
  }: {
    id: string;
    name: string;
    checked: boolean;
    value: boolean;
    label: string;
    onChange: (value: boolean) => void;
  }) {
    return (
      <label
        htmlFor={id}
        className="flex items-center space-x-2 px-2 py-1 rounded cursor-pointer transition-colors hover:bg-darkGrayBlue/10"
        style={{ minWidth: 48 }}
      >
        <input
          type="radio"
          id={id}
          name={name}
          checked={checked}
          onChange={() => onChange(value)}
          className="accent-darkGrayBlue w-4 h-4 cursor-pointer"
          aria-label={label}
        />
        <span className="text-xl font-cormorant select-none">{label}</span>
      </label>
    );
  }

  // AdditionalGuestRadio component for Yes/No selection
  function AdditionalGuestRadio({
    guestId,
    name,
    checked,
    onChange,
  }: {
    guestId: string;
    name: string;
    checked: boolean;
    onChange: (attending: boolean) => void;
  }) {
    return (
      <div className="flex flex-row gap-2 items-center">
        <YesNoRadioButton
          id={`additional-${guestId}-yes`}
          name={`additional-attending-${guestId}`}
          checked={checked}
          value={true}
          label="Yes"
          onChange={onChange}
        />
        <YesNoRadioButton
          id={`additional-${guestId}-no`}
          name={`additional-attending-${guestId}`}
          checked={!checked}
          value={false}
          label="No"
          onChange={onChange}
        />
      </div>
    );
  }

  return (
    <form action={enhancedAction} className="space-y-4">
      <input type="hidden" name="guestId" value={guestId} />
      <input type="hidden" name="guestName" value={guestName} />

      {/* RSVP Update Notice */}
      {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Edit className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">
              {hasExistingRsvp ? "Update Your RSVP" : "Submit Your RSVP"}
            </p>
            <p className="text-blue-600">
              {hasExistingRsvp
                ? "You can update your response anytime before the deadline. Your previous answers have been loaded below."
                : "You can update your response anytime after submitting, as long as it's before the deadline."}
            </p>
            {rsvpSettings?.deadline && (
              <p className="text-blue-600 mt-1">
                <Clock className="h-3 w-3 inline mr-1" />
                Deadline: {getDeadlineDisplay()} (Philippine Time)
              </p>
            )}
          </div>
        </div>
      </div> */}

      {/* Reserved Seats Section */}
      <div className="flex justify-center mt-2 mb-2">
        <span className="text-3xl md:text-4xl font-medium text-black font-cormorant">
          We reserved
          <span
            className="mx-4 font-spartan font-bold text-slateBlue text-5xl md:text-6xl underline decoration-black decoration-2 underline-offset-4"
            style={{
              textUnderlineOffset: "6px",
              textDecorationColor: "black",
              textDecorationThickness: "2px",
            }}
          >
            {` ${1 + additionalGuests.length} `}
          </span>
          seat{1 + additionalGuests.length !== 1 ? "s" : ""} for you.
        </span>
      </div>

      {/* RSVP Response */}
      <div className="space-y-4" ref={attendingRef}>
        <Label className="text-2xl font-cormorant text-black flex flex-col items-center gap-6 justify-center w-full text-center">
          <span className="block px-8">
            Kindly respond by{" "}
            <span className="font-montserrat text-xl">
              {getDeadlineDisplay()}
            </span>
            . We look forward to celebrating with you.
            <br />
            <div className="pb-4" />
            We wish to accommodate all our friends and family, but resources are
            limited. We hope for your kind understanding by not bringing plus
            ones to our event.
            <br />
          </span>
          <span className="block px-20">
            As we begin our forever, we’d be honored to have you by our side
          </span>
        </Label>
        <RadioGroup
          name="attending"
          value={attending}
          onValueChange={handleRSVPChoice}
          className="flex flex-row gap-6 justify-center"
          aria-invalid={!!errors.attending}
          aria-describedby={errors.attending ? "attending-error" : undefined}
        >
          <RSVPOption
            id="yes"
            label="Yes, I will be there!"
            selected={attending === "yes"}
            onClick={() => handleRSVPChoice("yes")}
            error={!!errors.attending}
            highlight="bg-darkGrayBlue/5"
          />
          <RSVPOption
            id="no"
            label="Sorry, I can't make it!"
            selected={attending === "no"}
            onClick={() => handleRSVPChoice("no")}
            error={!!errors.attending}
            highlight="bg-primary/10"
          />
        </RadioGroup>
        {/* Hidden input to ensure attending is included in formData */}
        <input type="hidden" name="attending" value={attending} />
        {errors.attending && (
          <div
            id="attending-error"
            className="flex items-center gap-1 text-red-600 text-sm"
          >
            <AlertCircle className="h-3 w-3" />
            {errors.attending}
          </div>
        )}
      </div>

      {/* Additional Guests - Always show if they exist */}
      {additionalGuests.length > 0 && (
        <Card className="bg-white/50 elegant-border">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between gap-2 mb-4 px-8">
              <div className="flex items-center gap-2">
                {/* <Users className="h-5 w-5 text-darkGrayBlue" /> */}
                <Label className="text-xl font-cormorant">
                  Additional Guests
                </Label>
              </div>
              <Label className="text-xl font-cormorant text-right min-w-[96px]">
                Attendance
              </Label>
            </div>

            {/* Show different messaging based on primary guest attendance */}
            {/* {attending === "no" && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium">Independent Guest Selection</p>
                    <p>
                      Even though you can't attend, your additional guests can
                      still choose to attend independently.
                    </p>
                  </div>
                </div>
              </div>
            )} */}

            {/* <p className="text-sm text-muted-foreground mb-4">
              {attending === "yes"
                ? "Please select which of your additional guests will be attending and update their contact information:"
                : "Please select which of your additional guests will be attending (they can attend even if you cannot):"}
            </p> */}

            <div className="space-y-4">
              {additionalGuests.map((guest) => (
                <div key={guest.id} className="rounded-lg px-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <Label
                      htmlFor={`additional-${guest.id}`}
                      className="flex-1"
                    >
                      <div className="font-cormorant text-2xl">
                        {guest.name}
                      </div>
                    </Label>
                    <AdditionalGuestRadio
                      guestId={guest.id}
                      name={guest.name}
                      checked={selectedAdditionalGuests.includes(guest.id)}
                      onChange={(attending) =>
                        handleAdditionalGuestToggle(guest.id, attending)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Primary Guest Contact Information */}
      <Card className="bg-white/50 elegant-border">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Label className="text-xl font-cormorant">
              Contact Information
            </Label>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3 w-full">
            <Label
              htmlFor="primaryGuestInfo"
              className="flex-1 min-w-[120px] md:w-auto md:text-left text-center"
            >
              <div className="font-cormorant text-xl">{guestName}</div>
            </Label>
            <div className="flex-1 w-full md:w-auto">
              <InputWithIcon
                type="tel"
                value={primaryGuestPhone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  let val = e.target.value.replace(/[^\d+]/g, "");
                  if (val.startsWith("+63")) {
                    val = "+63" + val.slice(3, 13);
                  } else if (val.startsWith("0")) {
                    val = val.slice(0, 11);
                  } else {
                    val = val.replace(/^\+?/, "");
                  }
                  setPrimaryGuestPhone(val);
                  if (errors.primaryPhone) {
                    setErrors((prev) => ({ ...prev, primaryPhone: "" }));
                  }
                }}
                placeholder="Phone Number"
                icon={Phone}
                ref={phoneRef}
                id="primaryPhone"
                pattern="^(09\d{9}|\+639\d{9})$"
                className={`${
                  errors.primaryPhone
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
                aria-invalid={!!errors.primaryPhone}
                aria-describedby={
                  errors.primaryPhone ? "phone-error" : undefined
                }
                inputMode="tel"
                maxLength={13}
              />
            </div>
            <div className="flex-1 w-full md:w-auto">
              <InputWithIcon
                type="email"
                value={primaryGuestEmail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPrimaryGuestEmail(e.target.value)
                }
                placeholder="Email Address"
                icon={Mail}
                ref={emailRef}
                id="primaryEmail"
              />
            </div>
          </div>

          {additionalGuests.map((guest) => (
            <div key={guest.id} className="rounded-lg space-y-3">
              {selectedAdditionalGuests.includes(guest.id) && (
                <div className="flex flex-col md:flex-row items-center gap-3 w-full">
                  <Label
                    htmlFor={`additional-${guest.id}`}
                    className="flex-1 min-w-[120px] md:w-auto md:text-left text-center"
                  >
                    <div className="font-cormorant text-xl">{guest.name}</div>
                  </Label>
                  <div className="flex-1 w-full md:w-auto">
                    <InputWithIcon
                      type="tel"
                      value={additionalGuestDetails[guest.id]?.phone || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateAdditionalGuestDetail(
                          guest.id,
                          "phone",
                          e.target.value
                        )
                      }
                      placeholder="Phone Number"
                      icon={Phone}
                    />
                  </div>
                  <div className="flex-1 w-full md:w-auto">
                    <InputWithIcon
                      type="email"
                      value={additionalGuestDetails[guest.id]?.email || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateAdditionalGuestDetail(
                          guest.id,
                          "email",
                          e.target.value
                        )
                      }
                      placeholder="Email Address"
                      icon={Mail}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Dietary Restrictions or Special Requests */}
      <Card className="bg-white/50 elegant-border">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Label
              htmlFor="dietaryRestrictions"
              className="text-xl font-cormorant"
            >
              Dietary Restrictions or Special Requests
            </Label>
          </div>
          <Textarea
            id="dietaryRestrictions"
            name="dietaryRestrictions"
            value={dietaryRestrictions}
            onChange={(e) => setDietaryRestrictions(e.target.value)}
            placeholder="Please let us know about any dietary restrictions or special requests for attending guests"
            className="mt-2 min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Message field - always show */}
      <Card className="bg-white/50 elegant-border">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Label htmlFor="message" className="text-xl font-cormorant">
              Message for the Couple
            </Label>
          </div>
          <Textarea
            id="message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              attending === "yes"
                ? "Share your excitement or well wishes!"
                : attending === "no"
                ? "We'd love to hear from you even though you can't make it!"
                : "Share your thoughts with us!"
            }
            className="mt-2 min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Required fields notice */}
      {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Required fields are marked with *</p>
            <p className="text-blue-600">
              {attending === "yes"
                ? "Phone number is required for attending guests so we can contact you about the event."
                : "Only your attendance response is required. Additional guests can attend independently."}
            </p>
          </div>
        </div>
      </div> */}

      {/* Enhanced error display */}
      {(state?.error || Object.keys(errors).length > 0) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-600">
              {state?.error && (
                <p className="font-medium mb-2">{state.error}</p>
              )}
              {Object.keys(errors).length > 0 && (
                <div>
                  <p className="font-medium mb-1">
                    Oops! We found some issues with your RSVP:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {errors.primaryPhone && <li>{errors.primaryPhone}</li>}
                    {errors.attending && (
                      <li>Please select whether you will be attending</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-darkGrayBlue hover:bg-darkGrayBlue/90 text-white py-6 text-lg font-medium elegant-shadow"
        disabled={isPending || isSubmitting}
      >
        {isPending || isSubmitting
          ? hasExistingRsvp
            ? "Updating..."
            : "Submitting..."
          : hasExistingRsvp
          ? "Update RSVP"
          : "Submit RSVP"}
      </Button>
    </form>
  );
}
