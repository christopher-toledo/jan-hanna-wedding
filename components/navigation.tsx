"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useParams } from "next/navigation";

export function Navigation() {
  // Helper to scroll to section by elementId derived from button text
  const scrollToSection = (section: string) => {
    const yOffset = -40;
    const elementId = section.toLowerCase().replace(/ /g, "-");
    const sectionElement = document.getElementById(elementId);
    if (sectionElement) {
      const y =
        sectionElement.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    } else {
      // If not on home page, navigate to home then scroll
      window.location.href = `/#${elementId}`;
    }
  };
  const params = useParams();
  const guestId = params.guestId as string;
  const pathname = usePathname();
  const hasGuestId = guestId && !pathname.includes("/rsvp");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-linen backdrop-blur-sm border-b border-primary/10">
      <div className="container me-8 mx-auto px-6">
        <div className="flex items-center justify-between h-12">
          <div className="hidden md:flex items-center space-x-8 ml-auto">
            {[
              "SAVE THE DATE",
              "OUR STORY",
              "DETAILS",
              "ATTIRE",
              // "TIMELINE",
              // "FAQ",
              // "GALLERY",
              ...(hasGuestId ? ["RSVP"] : []),
            ].map((label) => (
              <button
                key={label}
                onClick={() => scrollToSection(label)}
                className="text-2xl font-bold font-cormorant transition-colors text-darkGrayBlue hover:text-slateBlue"
              >
                {label}
              </button>
            ))}
          </div>

          <div className="md:hidden ml-auto">
            <Button variant="ghost" size="sm">
              Menu
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
