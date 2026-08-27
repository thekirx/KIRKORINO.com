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
  previewWidth?: number
  previewHeight?: number
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
    previewWidth: 1876,
    previewHeight: 1111,
  },
  {
    slug: 'casa-uno-villas',
    name: 'Casa Uno Villas',
    category: 'Hospitality',
    description: 'A serene villa experience that helps guests explore three private-pool stays and book directly.',
    featureHeadline: 'Casa Uno Villas',
    featureSummary: 'A serene villa experience designed around private pools, effortless discovery, and direct booking.',
    url: 'https://casa-uno-villas.vercel.app',
    featured: true,
    preview: '/previews/casa-uno-villas.jpg',
    previewAlt: 'Casa Uno Villas website homepage',
    previewWidth: 1275,
    previewHeight: 1700,
  },
  {
    slug: 'buff-coffee',
    name: 'Buff Coffee Club',
    category: 'Retail',
    description: 'A coffee brand built on comfort, energy, and pickup ordering across branches.',
    featureHeadline: 'Buff Coffee Club',
    featureSummary: 'Coffee, comfort, and a little extra shine—an ordering-first storefront with branch discovery built in.',
    url: 'https://buffcoffee.vercel.app',
    featured: true,
    preview: '/previews/buff-coffee.jpg',
    previewAlt: 'Buff Coffee Club website homepage',
    previewWidth: 1600,
    previewHeight: 1000,
  },
  {
    slug: 'tela-park',
    name: 'Tela Park',
    category: 'Sports & Wellness',
    description: 'A fourteen-court pickleball centre in Las Piñas with open play, coaching, and booking.',
    featureHeadline: 'Tela Park',
    featureSummary: 'Fourteen courts in Las Piñas—open play, coaching, and a booking flow for a growing community.',
    url: 'https://telaparkproject.vercel.app',
    featured: true,
    preview: '/previews/tela-park.jpg',
    previewAlt: 'Tela Park Pickleball Center website homepage',
    previewWidth: 1600,
    previewHeight: 1000,
  },
  {
    slug: 'cafe-1023',
    name: 'Cafe 10/23',
    category: 'Hospitality',
    description: 'A garden cafe in Imus shaped by family, creativity, and the simple joy of gathering.',
    featureHeadline: 'Cafe 10/23',
    featureSummary: 'A garden cafe in Imus, Cavite—built around family, creativity, good food, and the simple joy of gathering.',
    url: 'https://cafe1023.vercel.app',
    featured: true,
    preview: '/previews/cafe-1023.jpg',
    previewAlt: 'Cafe 10/23 website homepage',
    previewWidth: 1600,
    previewHeight: 881,
  },
  {
    slug: 'el-poco-cantina',
    name: 'El Poco Cantina',
    category: 'Hospitality',
    description: 'A Mexican cantina site built around birria, burritos, tacos, and two Manila branches.',
    featureHeadline: 'El Poco Cantina',
    featureSummary: 'Birria, burritos, and tacos across Malate and Sampaloc—an appetite-first site for two Manila branches.',
    url: 'https://elpococantina.vercel.app',
    featured: true,
    preview: '/previews/el-poco-cantina.jpg',
    previewAlt: 'El Poco Cantina website homepage',
    previewWidth: 1600,
    previewHeight: 1000,
  },
  {
    slug: 'oasis-pickleball',
    name: 'Oasis Pickleball Courts',
    category: 'Sports & Wellness',
    description: 'A covered-court venue in Bacoor with open play, coaching, and one-minute booking.',
    featureHeadline: 'Oasis Pickleball Courts',
    featureSummary: 'Covered courts in Molino, Bacoor—daily open play, rentals, and coaching, bookable in under a minute.',
    url: 'https://oasispickleph.vercel.app',
    featured: true,
    preview: '/previews/oasis-pickleball.jpg',
    previewAlt: 'Oasis Pickleball Courts website homepage',
    previewWidth: 1600,
    previewHeight: 875,
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
    previewWidth: 1200,
    previewHeight: 1446,
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
    previewWidth: 2048,
    previewHeight: 1536,
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
    previewWidth: 1800,
    previewHeight: 1013,
  },
]

export const archiveProjects: Project[] = [
  { slug: 'everyhype', name: 'Everyhype Store', category: 'Retail', description: 'Streetwear and hype storefront concept.', url: 'https://everyhypeph.vercel.app', featured: false, preview: '', previewAlt: 'Everyhype Store project' },
  { slug: 'carport-wheels', name: 'Carport Wheels', category: 'Automotive', description: 'Fitment-first wheel storefront on West Avenue.', url: 'https://carportph.vercel.app', featured: false, preview: '', previewAlt: 'Carport Wheels project' },
  { slug: 'optrizo-dentistry', name: 'Optrizo Dentistry', category: 'Healthcare', description: 'Dental practice website and appointment booking.', url: 'https://optrizodentistry.vercel.app', featured: false, preview: '', previewAlt: 'Optrizo Dentistry project' },
  { slug: 'linaw-finance', name: 'Linaw Finance', category: 'Software & Systems', description: 'Business finance dashboard.', url: 'https://linawfinance.vercel.app', featured: false, preview: '', previewAlt: 'Linaw Finance project' },
  { slug: 'parksys', name: 'ParkSYS', category: 'Software & Systems', description: 'Live parking availability experience.', url: 'https://park-sys.vercel.app', featured: false, preview: '', previewAlt: 'ParkSYS project' },
  { slug: 'carsys', name: 'CarSys / Apex Autohaus', category: 'Software & Systems', description: 'Automotive business system.', url: 'https://carsystemph.vercel.app', featured: false, preview: '', previewAlt: 'CarSys project' },
  { slug: 'wave-bar', name: 'Wave Bar & Restaurant', category: 'Hospitality', description: 'Restaurant and nightlife website.', url: 'https://wavebarandrestaurant.vercel.app', featured: false, preview: '', previewAlt: 'Wave Bar and Restaurant project' },
  { slug: 'cochi-by-marvin', name: 'Cochi by Marvin', category: 'Hospitality', description: 'Filipino restaurant brand website.', url: 'https://cochibymarvin.vercel.app', featured: false, preview: '', previewAlt: 'Cochi by Marvin project' },
  { slug: 'adz-garage', name: 'Adz Garage', category: 'Automotive', description: 'Automotive brand direction and website.', url: 'https://adzgarage.vercel.app', featured: false, preview: '', previewAlt: 'Adz Garage project' },
  { slug: 'vital-mpact', name: 'Vital Mpact', category: 'Sports & Wellness', description: 'Sports, fitness, and wellness website.', url: 'https://vitalmpact.vercel.app', featured: false, preview: '', previewAlt: 'Vital Mpact project' },
  { slug: 'pickque', name: 'PickQue', category: 'Sports & Wellness', description: 'Pickleball community experience.', url: 'https://pickque.vercel.app', featured: false, preview: '', previewAlt: 'PickQue project' },
  { slug: 'delta-sports', name: 'Delta Sports Arena', category: 'Sports & Wellness', description: 'Sports arena website.', url: 'https://deltasports.vercel.app', featured: false, preview: '', previewAlt: 'Delta Sports Arena project' },
  { slug: 'dink-arena', name: 'Dink Arena PH', category: 'Sports & Wellness', description: 'Pickleball venue website.', url: 'https://dinkarenaph.vercel.app', featured: false, preview: '', previewAlt: 'Dink Arena PH project' },
  { slug: 'mobilecart', name: 'MobileCart PH', category: 'Retail', description: 'Apple device storefront.', url: 'https://mobilecartph.vercel.app', featured: false, preview: '', previewAlt: 'MobileCart PH project' },
  { slug: 'currency-simulator', name: 'Currency Conversion Simulator', category: 'Software & Systems', description: 'Currency conversion utility.', url: 'https://currencysite.vercel.app', featured: false, preview: '', previewAlt: 'Currency Conversion Simulator project' },
  { slug: 'suncolor', name: 'Suncolor Graphics', category: 'Business Services', description: 'Premium printing services website.', url: 'https://suncolordraft.vercel.app', featured: false, preview: '', previewAlt: 'Suncolor Graphics project' },
  { slug: 'repmetric-360', name: 'RepMetric / 360', category: 'Software & Systems', description: 'Performance reporting interface.', url: 'https://repmetric-360.vercel.app', featured: false, preview: '', previewAlt: 'RepMetric 360 project' },
  { slug: 'reservation', name: 'Reservation', category: 'Hospitality', description: 'Simple reservation experience.', url: 'https://reservation-six-blush.vercel.app', featured: false, preview: '', previewAlt: 'Reservation project' },
]

export const allProjects = [...featuredProjects, ...archiveProjects]
