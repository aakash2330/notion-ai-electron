"use client";

import { Button } from "./ui/button";

export function CtaButton() {
  return (
    <Button
      onClick={() => {
        scrollTo("#heroForm");
      }}
    >
      Get Started
    </Button>
  );
}

function scrollTo(id: string) {
  const section = document.querySelector(id);
  section?.scrollIntoView({ behavior: "smooth", block: "start" });
}
