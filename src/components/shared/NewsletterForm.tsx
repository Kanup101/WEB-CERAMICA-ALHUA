"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="flex-1">
        <label className="sr-only" htmlFor="newsletter-email">
          Email
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          placeholder="tu@email.com"
          className="h-12 w-full rounded-full border border-[#D2BDA3] bg-white px-5 text-sm text-[#342A24] outline-none transition placeholder:text-[#9C8B7B] focus:border-[#8F5F45]"
        />
        {submitted ? (
          <p className="mt-2 text-sm text-[#5A6B45]">Gracias. Te avisaremos cuando haya novedades.</p>
        ) : null}
      </div>
      <Button type="submit" size="lg">
        Suscribirme
      </Button>
    </form>
  );
}
