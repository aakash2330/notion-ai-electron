"use client";

import { Button } from "./ui/button";

export function CtaButton() {
  return (
    <Button
      onClick={() => {
        scrollTo("#heroForm");
        fetch("http://localhost:3001/api/data")
          .then((response) => response.json())
          .then((data) => alert(data))
          .catch((error) => console.error("Error:", error));
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
