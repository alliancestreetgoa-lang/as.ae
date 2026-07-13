import type {
  NavItem,
  SolutionCard,
  ValueItem,
  Publication,
  Testimonial,
  PressLogo,
  FooterColumn,
  Region,
} from "@/types";

export const NAV_ITEMS: NavItem[] = [
  { label: "Business Setup", href: "/dubai-business-setup" },
  { label: "Banking Solutions", href: "/banking" },
  { label: "Accounting Service", href: "/bookkeeping-accounting" },
  { label: "Financial Solutions", href: "/financial-services" },
  { label: "Real Estate", href: "/real-estate" },
];

export const SOLUTIONS: SolutionCard[] = [
  {
    title: "Dubai Business Setup",
    description:
      "Our expert team of business strategists and international tax lawyers crafts tailored solutions to help businesses and their owners minimise tax liabilities, diversify assets and secure their wealth in the UAE.",
    icon: "setup",
  },
  {
    title: "Business/Private Banking",
    description:
      "Beyond business setup and expansion, leveraging our strong network connections we can guarantee bank account openings at prestigious banks and financial institutions of your choice - in a matter of hours or days.",
    icon: "banking",
  },
  {
    title: "Finance & Compliance",
    description:
      "To ensure accuracy and compliance, we provide comprehensive financial services, including bookkeeping, financial reporting, tax planning, auditing, and payroll management.",
    icon: "finance",
  },
  {
    title: "Strategic Investments",
    description:
      "Ultimately, we help clients strategically invest their new-won tax savings in a range of opportunities, such as prime real estate, offering exclusive deals inaccessible to the general public.",
    icon: "investment",
  },
];

export const VALUES: ValueItem[] = [
  {
    title: "Integrity",
    description:
      "We uphold the highest standards of honesty and transparency in all our interactions.",
  },
  {
    title: "Innovation",
    description:
      "We are innovative thinkers who challenge conventional norms to drive growth and success.",
  },
  {
    title: "Excellence",
    description:
      "We strive for excellence in every project and service we deliver.",
  },
];

export const PROCESS_TABS: string[] = [
  "Documentation & Business Setup",
  "Residency & Visa",
  "Business & Private Banking",
  "Tax & Compliance",
];

export const PROCESS_STATS = [
  { value: "200+", label: "Business Structures Built" },
  { value: "20+", label: "Tax Lawyers & Strategists" },
  { value: "17+", label: "Years Experience" },
];

export const PUBLICATIONS: Publication[] = [
  {
    outlet: "DAILY MAIL",
    title:
      "DAILY MAIL on how Stallone Shaikh's Blueprint to Tax-Free Company Formation Is Changing the Game for Digital Nomads",
    excerpt:
      "With zero personal income tax, a 9% federal corporate tax that many... (read more)",
    image: "/images/book-cover.png",
    href: "https://www.dailymail.co.uk/news/article-14919147/How-Stallone-Shaikhs-Blueprint-Tax-Free-Company-Formation-Changing-Game-Digital-Nomads.html",
  },
  {
    outlet: "FORBES",
    title:
      "FORBES recommends new Book of Alliance Street Consultancy Founder Stallone Shaikh",
    excerpt:
      "Stallone Shaikh's New Book Unveils The Ultimate Guide To Legal Tax Freedom In The UAE... (read more)",
    image: "/images/book-mockup.png",
    href: "https://forbesscotland.com/stallone-shaikhs-new-book-unveils-the-ultimate-guide-to-legal-tax-freedom-in-the-uae/",
  },
  {
    outlet: "GULF NEWS",
    title:
      "GULF NEWS on the Expansion of Alliance Street Consultancy with New Partner in Europe: Vasil Legal",
    excerpt:
      "Alliance Street Consultancy, a leading business consulting firm based in Dubai, has announced a strategic partnership with Vasil Legal, a renowned European law firm led by Martin Vasil. This collaboration will...",
    image: "/images/pub-gulfnews.avif",
    href: "https://gulfnews.com/business/corporate-news/alliance-street-consultancy-announces-strategic-partnership-with-vasil-legal-1.1726217791344",
  },
  {
    outlet: "BUSINESS INSIDER",
    title:
      "BUSINESS INSIDER on Alliance Street Consultancy Launching Compliance and Tax Support for UAE Startups and Companies",
    excerpt:
      "Alliance Street Consultancy offers a comprehensive suite of services, including company formation, visa applications, bank account assistance, tax advisory and more, providing businesses with the essential tools and precise processes needed to establish themselves in the region.",
    image: "/images/pub-businessinsider.jpg",
    href: "https://markets.businessinsider.com/news/stocks/alliance-street-consultancy-launches-bookkeeping-and-tax-services-for-uae-startups-and-companies-1033521417",
  },
  {
    outlet: "CEO WEEKLY",
    title: "CEO WEEKLY on Navigating the UAE Business Formation with Stallone Shaikh",
    excerpt:
      "Deciding to open a business is already daunting. However, navigating all the policy requirements and technicalities is even more challenging. In the burgeoning commerce of the United Arab Emirates (UAE),...",
    image: "/images/pub-ceoweekly.png",
    href: "https://ceoweekly.com/navigating-uae-business-formation-with-stallone-shaikh/",
  },
  {
    outlet: "DIGITAL JOURNAL",
    title:
      "Digital Journal on the Formula of Stallone Shaikh & Alliance Street Consultancy for Business Setup Success in Dubai",
    excerpt:
      "In the bustling heart of the United Arab Emirates (UAE), where ambition meets innovation, Stallone Shaikh and Alliance Street Consultancy have emerged as pivotal figures in transforming entrepreneurial dreams into tangible realities.",
    image: "/images/pub-digitaljournal.png",
    href: "https://www.digitaljournal.com/business/transforming-dreams-into-reality-the-formula-of-stallone-shaikh-of-alliance-street-consultancy-for-business-setup-success-in-dubai/article",
  },
  {
    outlet: "KHALEEJ TIMES",
    title:
      "KHALEEJ TIMES on Alliance Street Consultancy: The one-stop-shop business consultancy in UAE",
    excerpt:
      "Addressing this vital need for guidance and support is where firms like Alliance Street Consultancy come into play. By simplifying the business establishment process, Alliance Street Consultancy offers a holistic suite of services that facilitates the entrepreneurial journey.",
    image: "/images/pub-khaleejtimes.jpeg",
    href: "https://www.khaleejtimes.com/kt-network/meet-alliance-street-consultancy-the-one-stop-shop-business-consultancy-in-uae",
  },
  {
    outlet: "ASIA BUSINESS OUTLOOK",
    title:
      "ASIA BUSINESS OUTLOOK on Alliance Street Consultancy Steering Businesses to Growth with Bespoke Consulting Solutions",
    excerpt:
      "Named among the region's best, Alliance Street Consultancy is recognised for steering businesses to growth with bespoke, end-to-end consulting solutions across the UAE.",
    image: "/images/mission-team-homepage.jpg",
    href: "https://www.asiabusinessoutlook.com/services-and-consulting/cover-story/alliance-street-consultancy-steering-businesses-to-growth-with-bespoke-consulting-solutions-cid-1423.html",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "We've got our visas, bank accounts start to be opened, and we've just really benefited from his full ground knowledge of the, UK, tax and banking system and the same in The UAE. And, I wouldn't feel happier in anyone else's hands!",
    name: "Charlotte",
    company: "Henley Finance",
    image: "/images/photo-2.jpg",
  },
  {
    quote:
      "They are providing all of the education and resources that you need to understand that you're making a really good decision for your life and your business. So if you're on the fence, don't hesitate. Just reach out, and then they're more than happy to help you.",
    name: "Phaibion",
    company: "Royal Energy Marketing",
    image: "/images/mission-team.jpg",
  },
  {
    quote:
      "I could see that he understood the needs and requirements of our company. We embarked on the process, arrived in The UAE, and it's been a seamless flow of meetings, and we have everything in place for our new business life in The UAE.",
    name: "Richard",
    company: "Padbrook Finance",
    image: "/images/values-meeting.jpg",
  },
];

export const PRESS_LOGOS: PressLogo[] = [
  { name: "Forbes", src: "/images/press-forbes.png", width: 130 },
  { name: "Business Insider", src: "/images/press-businessinsider.png", width: 150 },
  { name: "Khaleej Times", src: "/images/press-khaleejtimes.png", width: 190 },
  { name: "Asia Business Outlook", src: "/images/press-asiabusinessoutlook.png", width: 200 },
  { name: "Benzinga", src: "/images/press-benzinga.png", width: 210 },
];

export const ORBIT_AVATARS = [
  "/images/orbit-1.png",
  "/images/orbit-2.png",
  "/images/orbit-3.png",
  "/images/orbit-4.png",
  "/images/orbit-5.png",
  "/images/orbit-6.png",
];

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Company",
    links: [
      { label: "About us", href: "/contact-us" },
      { label: "FAQ", href: "/faq" },
      { label: "Careers", href: "/contact-us" },
    ],
  },
  {
    heading: "Solutions",
    links: [
      { label: "UAE Business Setup", href: "/dubai-business-setup" },
      { label: "Business & Private Banking", href: "/banking" },
      { label: "Accounting, Tax & Compliance", href: "/bookkeeping-accounting" },
      { label: "Working Capital & Mortgage", href: "/financial-services" },
      { label: "Real Estate & Investments", href: "/real-estate" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: '"Fast-Track to Zero Tax"', href: "/contact-us", strong: "Free E-Book:" },
      { label: '"Dubai Banking Secrets"', href: "/contact-us", strong: "New Release:" },
      { label: "Book a Free 1:1 Online Workshop", href: "/contact-us" },
      { label: "Visit our Knowledge Center", href: "/case-studies" },
    ],
  },
];

export const REGIONS: Region[] = [
  {
    region: "United Arab Emirates",
    offices: [
      {
        country: "Dubai",
        city: "Dubai",
        address: "Oxford Tower 104, Business Bay",
        phone: "+971 4 262 7928",
        email: "info@alliancestreet.ae",
      },
      {
        country: "Ras Al Khaimah",
        city: "Ras Al Khaimah",
        address: "T1-SF-6B RAKEZ, Amenity Center, Al Hamra FZ",
        phone: "+971 7 207 7052",
        email: "info@alliancestreet.ae",
      },
    ],
  },
  {
    region: "Europe",
    offices: [
      {
        country: "United Kingdom",
        city: "United Kingdom",
        address: "Pine Tree House Gardiners Close, Basildon",
        phone: "+44 07427 431400",
        email: "info@alliancestreet.ae",
      },
      {
        country: "Germany",
        city: "Germany",
        address: "Garmischer Str. 4, 80339 Munich",
        phone: "+49 89 250066266",
        email: "info@alliancestreet.ae",
      },
      {
        country: "Austria",
        city: "Austria",
        address: "Schloßbergstraße 1, 6370 Kitzbühel",
        phone: "+43 1 742501006",
        email: "info@alliancestreet.ae",
      },
      {
        country: "Slovakia",
        city: "Slovakia",
        address: "Zizkova 4D, Kosice",
        phone: "+421 908 996 667",
        email: "info@alliancestreet.ae",
      },
    ],
  },
];
