"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();

  const scrollToGallery = () => {
    const gallerySection = document.getElementById("gallery");
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: "smooth" });
    } else {
      // If not on home page, navigate to home then scroll
      window.location.href = "/#gallery";
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-linen backdrop-blur-sm border-b border-primary/10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="font-serif text-xl text-primary">Jan & Hanna</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              href="/information"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/information"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              Information
            </Link>
            <button
              onClick={scrollToGallery}
              className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
            >
              Gallery
            </button>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              Menu
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
