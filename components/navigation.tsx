"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";

export function Navigation() {
  const params = useParams();
  const guestId = params.guestId as string;
  const pathname = usePathname();
  const hasGuestId = guestId && !pathname.includes("/rsvp");

  const navLinks = [
    "HOME",
    "SAVE THE DATE",
    "OUR STORY",
    "DETAILS",
    "ATTIRE",
    // "TIMELINE",
    // "FAQ",
    // "GALLERY",
    ...(hasGuestId ? ["RSVP"] : []),
  ];

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
      window.location.href = `/${guestId}#${elementId}`;
    }
  };

  // Mobile menu state
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      const menu = document.getElementById("mobile-nav-menu");
      if (menu && !menu.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-linen backdrop-blur-sm border-b border-primary/10">
      <div className="container me-8 mx-auto px-6">
        <div className="flex items-center justify-between h-12">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 ml-auto">
            {navLinks.map((label) => (
              <button
                key={label}
                onClick={() => scrollToSection(label)}
                className="text-2xl font-bold font-cormorant transition-colors text-darkGrayBlue hover:text-slateBlue"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden ml-auto relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Open menu"
            >
              Menu
            </Button>
            {menuOpen && (
              <div
                id="mobile-nav-menu"
                className="absolute right-0 mt-2 w-48 bg-white border border-primary/10 rounded-lg shadow-lg z-50"
              >
                {navLinks.map((label) => (
                  <button
                    key={label}
                    onClick={() => {
                      setMenuOpen(false);
                      scrollToSection(label);
                    }}
                    className="block w-full text-left px-6 py-3 text-lg font-cormorant font-bold text-darkGrayBlue hover:bg-slateBlue/10 transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
