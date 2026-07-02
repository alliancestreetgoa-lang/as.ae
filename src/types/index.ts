export interface NavItem {
  label: string;
  href: string;
}

export interface SolutionCard {
  title: string;
  description: string;
  icon: "setup" | "banking" | "finance" | "investment";
}

export interface ValueItem {
  title: string;
  description: string;
}

export interface ProcessTab {
  label: string;
}

export interface Publication {
  outlet: string;
  title: string;
  excerpt: string;
  image: string;
  href: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  company: string;
  image: string;
}

export interface PressLogo {
  name: string;
  src: string;
  width: number;
}

export interface FooterColumn {
  heading: string;
  links: { label: string; href: string; strong?: string }[];
}
