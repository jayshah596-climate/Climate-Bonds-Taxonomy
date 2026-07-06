export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export const primaryNav: NavLink[] = [
  { label: "Taxonomy Explorer", href: "/taxonomy" },
  { label: "Knowledge Graph", href: "/graph" },
  { label: "Global Map", href: "/map" },
];

export const roleNav: NavLink[] = [
  { label: "Investor Hub", href: "/investors" },
  { label: "Issuer Hub", href: "/issuers" },
  { label: "Certification Pathway", href: "/certification" },
];

export const resourceNav: NavLink[] = [
  { label: "Case Studies", href: "/case-studies", description: "Certified bonds in the real world" },
  { label: "Blog & Updates", href: "/blog", description: "Latest Climate Bonds news" },
  { label: "Download Center", href: "/downloads", description: "Criteria, methodologies, reports" },
  { label: "Analytics", href: "/analytics", description: "Coverage & market dashboards" },
  { label: "Glossary", href: "/glossary", description: "Key terms explained" },
  { label: "FAQ", href: "/faq", description: "Common questions answered" },
];

export const utilityNav: NavLink[] = [
  { label: "Bookmarks", href: "/bookmarks" },
  { label: "Compare Criteria", href: "/compare" },
  { label: "Admin", href: "/admin" },
];

export const footerNav = {
  Explore: primaryNav,
  "For You": roleNav,
  Resources: resourceNav,
  Platform: utilityNav,
};
