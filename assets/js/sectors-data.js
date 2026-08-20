/**
 * QOHEL AFRICA GROUP — STRATEGIC LIGHT EXCHANGE (SLX)
 * 20 Accessible Entrepreneurial Sectors Master Directory
 */

const SLX_SECTORS = [
  {
    id: 1,
    title: "Digital Marketing and Brand PR Agencies",
    category: "media",
    badge: "Media & Comms",
    description: "Social media automation, content engineering, and corporate visibility campaigns.",
    icon: `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>`
  },
  {
    id: 2,
    title: "Apparel Brands and Fashion Retail Houses",
    category: "retail",
    badge: "Apparel & Retail",
    description: "Clothing lines, boutique retail stores, and local textile manufacturing.",
    icon: `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10a2 2 0 002 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"/></svg>`
  },
  {
    id: 3,
    title: "Boutique Catering and Event Planning Firms",
    category: "hospitality",
    badge: "Hospitality & Events",
    description: "Corporate event management, wedding planning, and premium food supply logistics.",
    icon: `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>`
  },
  {
    id: 4,
    title: "Commercial Printing and Corporate Branding Houses",
    category: "media",
    badge: "Production & Print",
    description: "Large-scale printing, merchandise fabrication, and promotional branding.",
    icon: `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z"/></svg>`
  },
  {
    id: 5,
    title: "Private Logistics and Courier Services",
    category: "logistics",
    badge: "Logistics & Fleet",
    description: "Motorcycle delivery fleets, local moving companies, and regional cargo transport.",
    icon: `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/></svg>`
  },
  {
    id: 6,
    title: "Beauty Salons, Barber Studios, and Luxury Spas",
    category: "hospitality",
    badge: "Wellness & Grooming",
    description: "High-end grooming franchises, executive wellness hubs, and personal care studios.",
    icon: `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2a5 5 0 00-5 5c0 3.5 5 11 5 11s5-7.5 5-11a5 5 0 00-5-5zM12 9a2 2 0 110-4 2 2 0 010 4z"/></svg>`
  },
  {
    id: 7,
    title: "E-commerce Stores and Digital Retail Brands",
    category: "retail",
    badge: "E-Commerce",
    description: "Online consumer goods distribution, home accessory brands, and automated niche stores.",
    icon: `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>`
  },
  {
    id: 8,
    title: "Commercial Cleaning and Facilities Management",
    category: "services",
    badge: "Facilities",
    description: "Office cleaning contracts, residential deep cleans, and post-construction cleaning.",
    icon: `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M5 21V7l7-4 7 4v14M10 9v3M14 9v3M10 16v3M14 16v3"/></svg>`
  },
  {
    id: 9,
    title: "Private Daycares and Early Learning Centers",
    category: "services",
    badge: "Education & Care",
    description: "Local kindergarten setups, after-school care hubs, and child development studios.",
    icon: `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
  },
  {
    id: 10,
    title: "Fitness Centers and Wellness Gyms",
    category: "hospitality",
    badge: "Fitness & Health",
    description: "Community fitness studios, personal training centers, and sports nutrition retail.",
    icon: `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 4v16M18 4v16M2 8h4M18 8h4M2 16h4M18 16h4M6 12h12"/></svg>`
  },
  {
    id: 11,
    title: "Interior Design and Home Staging Firms",
    category: "services",
    badge: "Design & Spatial",
    description: "Commercial space styling, residential renovations, and furniture curation.",
    icon: `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10"/></svg>`
  },
  {
    id: 12,
    title: "Agribusiness and Organic Fresh Food Supply",
    category: "agro",
    badge: "Agribusiness",
    description: "Greenhouse farming, urban hydroponics, and value-addition food processing.",
    icon: `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM12 8v8M8 12h8"/></svg>`
  },
  {
    id: 13,
    title: "Professional Bakery and Pastry Houses",
    category: "hospitality",
    badge: "Food & Confectionery",
    description: "Commercial confectionery production, wholesale supply to supermarkets, and café operations.",
    icon: `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-8a2 2 0 00-2-2H6a2 2 0 00-2 2v8M4 11V7a4 4 0 014-4h8a4 4 0 014 4v4M12 3v8"/></svg>`
  },
  {
    id: 14,
    title: "Corporate Training and Human Resource Consultancies",
    category: "consulting",
    badge: "Executive HR",
    description: "Talent headhunting, staff training workshops, and management advisory services.",
    icon: `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>`
  },
  {
    id: 15,
    title: "Tech Support and Hardware Maintenance Outlets",
    category: "media",
    badge: "IT & Infrastructure",
    description: "Office network installations, smart device repairs, and IT hardware distribution.",
    icon: `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg>`
  },
  {
    id: 16,
    title: "Boutique Travel and Tour Guide Agencies",
    category: "hospitality",
    badge: "Travel & Leisure",
    description: "Local tourism curation, corporate team-building retreats, and holiday booking services.",
    icon: `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>`
  },
  {
    id: 17,
    title: "Real Estate Brokerage and Property Management Agencies",
    category: "services",
    badge: "Real Estate",
    description: "Residential rental management, property sales brokerage, and site-viewing logistics.",
    icon: `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M4 18h16V6l-8-4-8 4v12zM9 10h1M14 10h1M9 14h1M14 14h1"/></svg>`
  },
  {
    id: 18,
    title: "Artisan Furniture Design and Workshop Assemblies",
    category: "services",
    badge: "Manufacturing",
    description: "Custom wood and metal fabrication, office furniture supplies, and home design manufacturing.",
    icon: `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM4 12h16M12 7v14"/></svg>`
  },
  {
    id: 19,
    title: "Water Purification and Bottling Stations",
    category: "agro",
    badge: "Utilities & Supply",
    description: "Neighborhood water distribution hubs, bulk corporate refills, and branded water supply lines.",
    icon: `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>`
  },
  {
    id: 20,
    title: "Financial Bookkeeping and Tax Advisory Practices",
    category: "consulting",
    badge: "Finance & Tax",
    description: "Small business accounting services, audit preparations, and local tax compliance consulting.",
    icon: `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>`
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SLX_SECTORS };
}
