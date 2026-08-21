export type ProjectCategory =
  | 'Automotive'
  | 'Hospitality'
  | 'Healthcare'
  | 'Sports & Wellness'
  | 'Retail'
  | 'Software & Systems'
  | 'Business Services'
  | 'Experiments'

export interface Project {
  slug: string
  name: string
  category: ProjectCategory
  description: string
  url: string
  featured: boolean
  preview: string
  previewAlt: string
  featureHeadline?: string
  featureSummary?: string
}

export const featuredProjects: Project[] = [
  {
    slug: 'hakum-auto-care',
    name: 'Hakum Auto Care',
    category: 'Automotive',
    description: 'A high-impact customer site paired with useful tools for branches, queues, inquiries, and operations.',
    featureHeadline: 'Hakum Auto Care',
    featureSummary: 'A high-impact customer site paired with tools for branches, queues, inquiries, and operations.',
    url: 'https://auto-detailingand-carwash.vercel.app',
    featured: true,
    preview: '/previews/hakum-auto-care.webp',
    previewAlt: 'Hakum Auto Care website homepage',
  },
  {
    slug: 'casa-uno-villas',
    name: 'Casa Uno Villas',
    category: 'Hospitality',
    description: 'A serene villa experience that helps guests explore three private-pool stays and book directly.',
    featureHeadline: 'Stay Uno.',
    featureSummary: 'A serene villa experience designed around private pools, effortless discovery, and direct booking.',
    url: 'https://casa-uno-villas.vercel.app',
    featured: true,
    preview: '/previews/casa-uno-villas.jpg',
    previewAlt: 'Casa Uno Villas website homepage',
  },
  {
    slug: 'optrizo-dentistry',
    name: 'Optrizo Dentistry',
    category: 'Healthcare',
    description: 'A reassuring dental experience that turns treatment discovery into simple appointment booking.',
    featureHeadline: 'Precision meets calm.',
    featureSummary: 'Optrizo turns appointment discovery into a confident booking experience—clear, measured, and reassuring.',
    url: 'https://optrizodentistry.vercel.app',
    featured: true,
    preview: '/previews/optrizo-dentistry.jpg',
    previewAlt: 'Optrizo Dentistry website homepage',
  },
  {
    slug: 'linaw-finance',
    name: 'Linaw Finance',
    category: 'Software & Systems',
    description: 'A friendly financial dashboard that turns daily business numbers into a clear picture.',
    featureHeadline: 'Linaw.',
    featureSummary: 'A business dashboard that turns daily numbers into one understandable picture.',
    url: 'https://linawfinance.vercel.app',
    featured: true,
    preview: '/previews/linaw-finance.jpg',
    previewAlt: 'Linaw Finance product homepage',
  },
  {
    slug: 'kaen-manila',
    name: 'Kaen Manila',
    category: 'Hospitality',
    description: 'A vivid restaurant experience built around fire, produce, people, and appetite.',
    featureHeadline: 'Kaen Manila',
    featureSummary: 'A vivid restaurant experience built around fire, produce, people, and appetite.',
    url: 'https://kaenmanila.vercel.app',
    featured: true,
    preview: '/previews/kaen-manila.avif',
    previewAlt: 'Kaen Manila website homepage',
  },
  {
    slug: 'skycourt',
    name: 'SkyCourt',
    category: 'Sports & Wellness',
    description: 'A vibrant rooftop pickleball destination with clear venue information and booking pathways.',
    featureHeadline: 'SkyCourt',
    featureSummary: 'A vibrant rooftop pickleball destination built for clear venue discovery and booking.',
    url: 'https://skycourtrooftop.vercel.app',
    featured: true,
    preview: '/previews/skycourt.webp',
    previewAlt: 'SkyCourt rooftop pickleball website homepage',
  },
  {
    slug: 'que-perfumery',
    name: 'Que Perfumery',
    category: 'Retail',
    description: 'A scent-led storefront that helps shoppers discover a signature fragrance.',
    featureHeadline: 'Que Perfumery',
    featureSummary: 'A scent-led storefront designed to make signature-fragrance discovery feel personal.',
    url: 'https://queperfumery.vercel.app',
    featured: true,
    preview: '/previews/que-perfumery.jpg',
    previewAlt: 'Que Perfumery online store homepage',
  },
]

export const archiveProjects: Project[] = [
  { slug: 'parksys', name: 'ParkSYS', category: 'Software & Systems', description: 'Live parking availability experience.', url: 'https://park-sys.vercel.app', featured: false, preview: '', previewAlt: 'ParkSYS project' },
  { slug: 'carsys', name: 'CarSys / Apex Autohaus', category: 'Software & Systems', description: 'Automotive business system.', url: 'https://carsystemph.vercel.app', featured: false, preview: '', previewAlt: 'CarSys project' },
  { slug: 'wave-bar', name: 'Wave Bar & Restaurant', category: 'Hospitality', description: 'Restaurant and nightlife website.', url: 'https://wavebarandrestaurant.vercel.app', featured: false, preview: '', previewAlt: 'Wave Bar and Restaurant project' },
  { slug: 'cochi-by-marvin', name: 'Cochi by Marvin', category: 'Hospitality', description: 'Filipino restaurant brand website.', url: 'https://cochibymarvin.vercel.app', featured: false, preview: '', previewAlt: 'Cochi by Marvin project' },
  { slug: 'adz-garage', name: 'Adz Garage', category: 'Automotive', description: 'Automotive brand direction and website.', url: 'https://adzgarage.vercel.app', featured: false, preview: '', previewAlt: 'Adz Garage project' },
  { slug: 'vital-mpact', name: 'Vital Mpact', category: 'Sports & Wellness', description: 'Sports, fitness, and wellness website.', url: 'https://vitalmpact.vercel.app', featured: false, preview: '', previewAlt: 'Vital Mpact project' },
  { slug: 'buff-coffee', name: 'Buff Coffee Club', category: 'Retail', description: 'Coffee retail experience.', url: 'https://buffcoffee.vercel.app', featured: false, preview: '', previewAlt: 'Buff Coffee Club project' },
  { slug: 'pickque', name: 'PickQue', category: 'Sports & Wellness', description: 'Pickleball community experience.', url: 'https://pickque.vercel.app', featured: false, preview: '', previewAlt: 'PickQue project' },
  { slug: 'tela-park', name: 'Tela Park', category: 'Sports & Wellness', description: 'Pickleball center website.', url: 'https://telaparkproject.vercel.app', featured: false, preview: '', previewAlt: 'Tela Park project' },
  { slug: 'delta-sports', name: 'Delta Sports Arena', category: 'Sports & Wellness', description: 'Sports arena website.', url: 'https://deltasports.vercel.app', featured: false, preview: '', previewAlt: 'Delta Sports Arena project' },
  { slug: 'dink-arena', name: 'Dink Arena PH', category: 'Sports & Wellness', description: 'Pickleball venue website.', url: 'https://dinkarenaph.vercel.app', featured: false, preview: '', previewAlt: 'Dink Arena PH project' },
  { slug: 'mobilecart', name: 'MobileCart PH', category: 'Retail', description: 'Apple device storefront.', url: 'https://mobilecartph.vercel.app', featured: false, preview: '', previewAlt: 'MobileCart PH project' },
  { slug: 'currency-simulator', name: 'Currency Conversion Simulator', category: 'Software & Systems', description: 'Currency conversion utility.', url: 'https://currencysite.vercel.app', featured: false, preview: '', previewAlt: 'Currency Conversion Simulator project' },
  { slug: 'suncolor', name: 'Suncolor Graphics', category: 'Business Services', description: 'Premium printing services website.', url: 'https://suncolordraft.vercel.app', featured: false, preview: '', previewAlt: 'Suncolor Graphics project' },
  { slug: 'repmetric-360', name: 'RepMetric / 360', category: 'Software & Systems', description: 'Performance reporting interface.', url: 'https://repmetric-360.vercel.app', featured: false, preview: '', previewAlt: 'RepMetric 360 project' },
  { slug: 'reservation', name: 'Reservation', category: 'Hospitality', description: 'Simple reservation experience.', url: 'https://reservation-six-blush.vercel.app', featured: false, preview: '', previewAlt: 'Reservation project' },
]

export const allProjects = [...featuredProjects, ...archiveProjects]
