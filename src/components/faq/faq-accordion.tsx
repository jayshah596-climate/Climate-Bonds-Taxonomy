"use client";

import * as React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import type { Faq } from "@/lib/types";

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openValue, setOpenValue] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && faqs.some((f) => f.id === hash)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing initial open panel from the URL hash on mount
      setOpenValue(hash);
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  }, [faqs]);

  return (
    <Accordion
      type="single"
      collapsible
      className="mx-auto max-w-3xl"
      value={openValue}
      onValueChange={setOpenValue}
    >
      {faqs.map((f) => (
        <AccordionItem key={f.id} value={f.id}>
          <AccordionTrigger id={f.id} className="scroll-mt-24 text-left">
            {f.question}
          </AccordionTrigger>
          <AccordionContent>{f.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
