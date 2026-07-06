import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
  description: "Search sectors, criteria, downloads, blogs, case studies, FAQs and glossary terms.",
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
