import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  User,
  Lead,
  QuoteRequest,
  Product,
  Project,
  BlogArticle,
  ServiceItem,
  SubsidyDetail,
  Testimonial,
  FAQItem,
  GalleryItem,
  JobOpening,
  JobApplication,
  AppSettings,
  HeroSlide,
  AuditLog,
  VisitorLog,
  EmailNotification
} from '../types.js';

interface DatabaseSchema {
  users: User[];
  passwords: Record<string, string>; // userId -> hashedPassword
  leads: Lead[];
  quotes: QuoteRequest[];
  products: Product[];
  projects: Project[];
  blogs: BlogArticle[];
  services: ServiceItem[];
  subsidies: SubsidyDetail[];
  testimonials: Testimonial[];
  faqs: FAQItem[];
  gallery: GalleryItem[];
  jobs: JobOpening[];
  jobApplications: JobApplication[];
  settings: AppSettings;
  heroSlides?: HeroSlide[];
  auditLogs: AuditLog[];
  visitorLogs?: VisitorLog[];
  emailNotifications?: EmailNotification[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Default initial state
const defaultUsers: User[] = [
  {
    id: 'usr-0',
    name: 'Sarva Solar Admin',
    email: 'sarvasolars@gmail.com',
    role: 'Admin',
    phone: '+91 8985430100',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-1',
    name: 'Jupalli Venkatesh Kumar',
    email: 'admin@sarvasolar.com',
    role: 'Admin',
    phone: '+91 7036590780',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-2',
    name: 'Ramesh Verma',
    email: 'manager@sarvasolar.com',
    role: 'Manager',
    phone: '+91 9160513161',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-3',
    name: 'Anil Kumar',
    email: 'employee@sarvasolar.com',
    role: 'Employee',
    phone: '+91 9876543210',
    createdAt: new Date().toISOString()
  }
];

const defaultSettings: AppSettings = {
  companyName: 'Sarva Solar',
  tagline: 'Empowering Homes & Businesses with Clean Solar Energy',
  phone1: '+91 8985430100',
  phone2: '+91 9160513161',
  email: 'solarsarva@gmail.com',
  address: "SARVA GROUP of Company's, Brodipet 5/15 Guntur Andhra Pradesh pincode:-522002, India",
  whatsappNumber: '918985430100',
  workingHours: 'Mon - Sat: 9:00 AM - 7:00 PM',
  announcementBarText: '⚡ Govt Subsidy under PM Surya Ghar Scheme up to ₹78,000 available! Book your free site survey today.',
  showAnnouncementBar: true,
  metaTitle: 'Sarva Solar - Leading Solar Energy EPC Solutions in AP, Telangana & WB',
  metaDescription: 'Sarva Solar provides premium residential, commercial & industrial solar rooftop solutions with government subsidy assistance and zero EMI options.',
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3829.418294719208!2d80.4328!3d16.3067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4a755d55555555%3A0x1111111111111111!2sGuntur%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin'
};

const defaultHeroSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    badge: 'PM Surya Ghar Govt Subsidy Assistance up to ₹78,000',
    title: 'Green Power, Bright Future. Clean Solar Energy for Every Roof.',
    subtitle: 'Sarva Solar is a premier EPC solar partner across Andhra Pradesh, Telangana & West Bengal. Eliminate electricity bills with Tier-1 bifacial modules & DISCOM net-metering.',
    mediaType: 'image',
    mediaUrl: '/src/assets/images/regenerated_image_1784933875727.jpg',
    ctaPrimaryText: 'Get Free Instant Quote',
    ctaPrimaryAction: 'quote',
    ctaSecondaryText: 'Calculate Solar Savings',
    ctaSecondaryAction: 'calculators',
    order: 1
  },
  {
    id: 'slide-2',
    badge: 'Industrial & Commercial Rooftop Solar EPC',
    title: 'Slash Commercial Electricity Overhead by up to 80%',
    subtitle: 'High-capacity 50kWp to 1MWp solar installations for factories, cold storages, and commercial complexes with accelerated depreciation tax benefits.',
    mediaType: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-solar-panels-on-a-roof-in-a-sunny-day-41318-large.mp4',
    ctaPrimaryText: 'Request Commercial Audit',
    ctaPrimaryAction: 'quote',
    ctaSecondaryText: 'Explore Commercial Projects',
    ctaSecondaryAction: 'projects',
    order: 2
  },
  {
    id: 'slide-3',
    badge: 'Smart Off-Grid & Hybrid Solar Storage',
    title: 'Uninterrupted Power 24/7 with Hybrid Solar Storage',
    subtitle: 'Intelligent lithium battery back-up solutions ensuring continuous zero-interruption solar power for farms, villas, and sensitive medical/IT setups.',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1542336391-ae2936d8eff4?auto=format&fit=crop&w=2000&q=80',
    ctaPrimaryText: 'View Solar Packages',
    ctaPrimaryAction: 'products',
    ctaSecondaryText: 'Talk to Solar Engineer',
    ctaSecondaryAction: 'contact',
    order: 3
  }
];

const defaultSubsidies: SubsidyDetail[] = [
  {
    id: 'sub-1',
    schemeName: 'PM Surya Ghar: Muft Bijli Yojana (1 kW System)',
    capacityRange: '1 kWp',
    centralSubsidyAmount: 30000,
    stateBonusAmount: 0,
    eligibility: [
      'Must be an Indian residential household with valid electricity connection',
      'Roof space must be suitable for solar installation (min 80-100 sq ft shadow-free)',
      'Electricity consumer account registered in applicant name'
    ],
    documents: [
      'Aadhaar Card copy',
      'Recent Electricity Bill (last 3 months)',
      'Roof Ownership Proof / House Tax Receipt',
      'Bank Account passbook / Cancelled Cheque for Direct Benefit Transfer'
    ],
    processSteps: [
      'Register on National Portal for Rooftop Solar (PM Surya Ghar)',
      'Sarva Solar performs site inspection and submits technical feasibility report',
      'Installation of Tier-1 solar modules & net meter by Sarva Solar certified engineers',
      'DISCOM inspection & Net Metering approval',
      'Direct Subsidy Credit into customer bank account within 30 days'
    ],
    updatedDate: '2026-06-01'
  },
  {
    id: 'sub-2',
    schemeName: 'PM Surya Ghar: Muft Bijli Yojana (2 kW System)',
    capacityRange: '2 kWp',
    centralSubsidyAmount: 60000,
    stateBonusAmount: 0,
    eligibility: [
      'Residential house with monthly power consumption 150 - 300 units',
      'Shadow-free rooftop area of minimum 160-200 sq ft'
    ],
    documents: [
      'Aadhaar Card',
      'Latest DISCOM Electricity Bill',
      'Bank Account Passbook / Cancelled Cheque'
    ],
    processSteps: [
      'Online application on PM Surya Ghar portal',
      'Sarva Solar technical team feasibility report',
      'Turnkey installation & safety inspection',
      'Net Meter commissioning by DISCOM',
      'Direct Subsidy Disbursement ₹60,000 to bank account'
    ],
    updatedDate: '2026-06-01'
  },
  {
    id: 'sub-3',
    schemeName: 'PM Surya Ghar: Muft Bijli Yojana (3 kW to 10 kW)',
    capacityRange: '3 kWp - 10 kWp',
    centralSubsidyAmount: 78000,
    stateBonusAmount: 10000,
    eligibility: [
      'Residential homeowners with higher power bill (> 300 units/month)',
      'Min 300 sq ft shadow-free roof area'
    ],
    documents: [
      'Aadhaar Card & PAN Card',
      'Electricity Bill with Service Connection Number',
      'Rooftop clearance certificate'
    ],
    processSteps: [
      'Portal registration & DISCOM approval',
      'EPC execution by Sarva Solar certified installers',
      'Bi-directional Net Metering setup',
      'Subsidy claim generation & Direct Benefit Transfer of ₹78,000'
    ],
    updatedDate: '2026-06-01'
  }
];

const defaultServices: ServiceItem[] = [
  {
    id: 'srv-1',
    title: 'Residential Solar Solutions',
    slug: 'residential-solar',
    shortDesc: 'Cut electricity bills by up to 90% with custom rooftop solar plants and government subsidy assistance.',
    fullDesc: 'Transform your home into an independent clean energy generator with Sarva Solar residential rooftop systems. We offer complete EPC (Engineering, Procurement & Construction) solutions, handling everything from structural engineering to net metering approval and PM Surya Ghar subsidy claims.',
    iconName: 'Home',
    benefits: [
      'Save up to ₹60,000 to ₹1,20,000 annually on electricity bills',
      'Up to ₹78,000 direct central government subsidy',
      '25-year linear performance warranty on bifacial / mono PERC panels',
      'Payback period as short as 3 to 4 years',
      'Zero upfront hassle with custom EMI & bank financing support'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1200&q=80',
    faqs: [
      { question: 'How much roof space is required for a 3kW residential solar plant?', answer: 'A 3kW system requires approximately 240-300 sq. ft. of shadow-free rooftop space.' },
      { question: 'Will my solar plant work during power outages?', answer: 'On-grid plants shut down during grid outages for lineman safety. If you install an Hybrid system with LFP battery backup, your home powers seamlessly during grid failures.' }
    ]
  },
  {
    id: 'srv-2',
    title: 'Commercial & Corporate Solar',
    slug: 'commercial-solar',
    shortDesc: 'Optimize operational expenses for offices, hospitals, schools, and retail with high-ROI solar power.',
    fullDesc: 'Commercial power tariffs in India are among the highest. Sarva Solar commercial EPC projects reduce corporate energy costs dramatically, qualify for 40% Accelerated Depreciation tax benefits, and boost ESG compliance scores.',
    iconName: 'Building2',
    benefits: [
      'Drastically reduce commercial grid power tariff costs',
      'Avail 40% Accelerated Depreciation tax savings in Year 1',
      '24/7 Remote IoT monitoring of power yield and panel performance',
      'Custom solar carport and elevated structure options for usable roof space'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1200&q=80',
    faqs: [
      { question: 'What is the average ROI for commercial solar plants?', answer: 'Commercial solar plants generally deliver full payback within 2.5 to 3.5 years due to higher commercial electricity tariffs.' }
    ]
  },
  {
    id: 'srv-3',
    title: 'Industrial Mega Solar Plants',
    slug: 'industrial-solar',
    shortDesc: 'High-capacity solar infrastructure for factories, textile mills, cold storages, and manufacturing units.',
    fullDesc: 'Heavy manufacturing and processing industries require dependable high-capacity continuous energy. We design and deploy high-voltage grid-tied solar systems up to 5 MWp with automated thermal imaging monitoring and high-tensile hot-dip galvanized mounting structures.',
    iconName: 'Factory',
    benefits: [
      'MW-scale turnkey EPC execution with utility-scale inverters',
      'High thermal endurance modules designed for industrial dust & heat',
      'Custom PPA (Power Purchase Agreement) & OPEX/CAPEX business models'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    faqs: [
      { question: 'Can Sarva Solar install solar on tin or metallic factory roofs?', answer: 'Yes! We use specialized non-penetrating aluminum standing seam clamps and elevated HDG structural mounts tailored for tin shed roofs.' }
    ]
  },
  {
    id: 'srv-4',
    title: 'Agriculture Solar Pumps',
    slug: 'agriculture-solar',
    shortDesc: 'Reliable daytime irrigation for farmers using high-torque solar water pumps and PM KUSUM assistance.',
    fullDesc: 'Empowering farmers in Andhra Pradesh, Telangana, and West Bengal with daytime uninterrupted irrigation. Sarva Solar agricultural pump systems eliminate dependence on erratic grid power and diesel generator expenses.',
    iconName: 'Tractor',
    benefits: [
      'Consistent daytime crop irrigation without power cut interruptions',
      'Zero recurring fuel cost compared to diesel pump sets',
      'Durable stainless steel submersible pumps with MPPT solar controllers'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1592833159057-651427233215?auto=format&fit=crop&w=1200&q=80',
    faqs: [
      { question: 'What hp solar pump is recommended for 5 acres of agriculture?', answer: 'A 5 HP to 7.5 HP solar submersible pump set is usually recommended depending on water table depth.' }
    ]
  },
  {
    id: 'srv-5',
    title: 'Battery Energy Storage (BESS)',
    slug: 'battery-storage',
    shortDesc: 'Advanced Lithium Iron Phosphate (LiFePO4) storage for 24/7 backup and peak load shifting.',
    fullDesc: 'Pair solar energy with modular, ultra-safe Lithium LFP battery banks. Store excess solar power generated during midday sunshine to power your lights, refrigerators, and heavy loads through the night or grid outages.',
    iconName: 'Zap',
    benefits: [
      '6,000+ deep discharge cycle life (15+ year lifespan)',
      'Modular expandable capacity from 5kWh to 100kWh+',
      'Instant microsecond backup switchover for sensitive appliances'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1558441719-6705167e33ae?auto=format&fit=crop&w=1200&q=80',
    faqs: [
      { question: 'What is the battery life of LiFePO4 vs lead acid?', answer: 'LiFePO4 batteries last 10-15 years (over 6000 cycles) compared to lead-acid batteries which fail in 2-3 years.' }
    ]
  },
  {
    id: 'srv-6',
    title: 'Solar Maintenance & AMC Services',
    slug: 'solar-maintenance',
    shortDesc: 'Automated panel cleaning, thermal inspection, inverter calibration, and health checks.',
    fullDesc: 'Dust, bird drop stains, and loose cable contacts can drop solar output by 15-25%. Sarva Solar offers annual maintenance contracts (AMC), robotic/sprinkler cleaning solutions, and infrared thermal imaging to guarantee peak yield.',
    iconName: 'Wrench',
    benefits: [
      'Preventive biannual structural and electrical audit',
      'High-pressure pure water deionized panel cleaning service',
      'Rapid 24-hour technician response for troubleshooting'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1548611716-300481845110?auto=format&fit=crop&w=1200&q=80',
    faqs: [
      { question: 'How often should solar panels be cleaned in India?', answer: 'In dry or high-dust areas, cleaning every 15-20 days restores full power generation efficiency.' }
    ]
  }
];

const defaultProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Sarva Ultra BIFACIAL 550W Mono PERC Panel',
    category: 'Solar Panels',
    brand: 'Sarva Solar / Tier 1 OEM',
    price: 14500,
    rating: 4.9,
    specs: {
      'Wattage': '550W',
      'Cell Type': 'N-Type Bifacial Mono PERC',
      'Efficiency': '22.8%',
      'Glass': 'Dual Glass 2.0mm Tempered',
      'Frame': 'Anodized Aluminum Alloy 35mm'
    },
    description: 'Generates up to 25% extra electricity from rear-side light reflections. Engineered for high performance in hot Indian weather conditions.',
    warranty: '12 Years Product Warranty, 30 Years Linear Power Output Warranty',
    imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    inventory: 250
  },
  {
    id: 'prod-2',
    name: 'Sarva High-Yield 540W Mono PERC Module',
    category: 'Solar Panels',
    brand: 'Sarva Solar / Goldi',
    price: 13200,
    rating: 4.8,
    specs: {
      'Wattage': '540W',
      'Cell Type': 'Half-Cut Monocrystalline',
      'Efficiency': '21.5%',
      'Junction Box': 'IP68 Waterproof'
    },
    description: 'High-density half-cut design reduces internal resistance loss and shaded cell hot-spot risks.',
    warranty: '10 Years Product, 25 Years Performance Warranty',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    inventory: 180
  },
  {
    id: 'prod-3',
    name: 'Sarva Hybrid Smart Inverter 5kVA MPPT',
    category: 'Inverters',
    brand: 'Sarva Solar / Havells OEM',
    price: 48500,
    rating: 4.9,
    specs: {
      'Capacity': '5 kW / 5 kVA',
      'Topology': 'Transformerless High Frequency',
      'MPPT Range': '120V - 450V DC',
      'Efficiency': '98.2%',
      'Connectivity': 'WiFi / Bluetooth App Monitoring'
    },
    description: 'Dual MPPT hybrid string inverter capable of managing grid feed-in, battery storage charging, and essential home load backup.',
    warranty: '5 Years Manufacturer Warranty (Extendable to 10 Years)',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    inventory: 65
  },
  {
    id: 'prod-4',
    name: 'Sarva Smart Grid-Tied Inverter 10kW 3-Phase',
    category: 'Inverters',
    brand: 'Sarva Solar / Sungrow OEM',
    price: 78000,
    rating: 4.9,
    specs: {
      'Capacity': '10 kW',
      'Phases': 'Three Phase 415V',
      'Efficiency': '98.6%',
      'Protection': 'Integrated Type II DC & AC Surge Protection'
    },
    description: 'Ideal for commercial & large residential installations with seamless DISCOM grid sync.',
    warranty: '10 Years Standard Warranty',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    isFeatured: false,
    inventory: 40
  },
  {
    id: 'prod-5',
    name: 'Sarva PowerWall 5.12kWh LiFePO4 Battery',
    category: 'Batteries',
    brand: 'Sarva Solar / LFP Core',
    price: 125000,
    rating: 5.0,
    specs: {
      'Capacity': '5.12 kWh / 100Ah',
      'Nominal Voltage': '51.2V DC',
      'Chemistry': 'Lithium Iron Phosphate (LiFePO4)',
      'Cycle Life': '6,000+ Cycles @ 80% DoD',
      'BMS': 'Smart BMS with CAN / RS485 Communication'
    },
    description: 'Sleek wall-mountable smart battery with zero maintenance, ultra-fast charging, and thermal runaway safety.',
    warranty: '10 Years Replacement Warranty',
    imageUrl: 'https://images.unsplash.com/photo-1558441719-6705167e33ae?auto=format&fit=crop&w=800&q=80',
    isFeatured: true,
    inventory: 30
  },
  {
    id: 'prod-6',
    name: 'Heavy Duty HDG Solar Mounting Structure 3kW',
    category: 'Mounting Structures',
    brand: 'Sarva Structures',
    price: 18500,
    rating: 4.7,
    specs: {
      'Material': 'Hot-Dip Galvanized Steel (80 microns coating)',
      'Wind Speed Rating': 'Up to 170 km/h cyclone proof',
      'Tilt Angle': '15° - 20° Adjustable',
      'Hardware': 'SS304 Stainless Steel Bolts'
    },
    description: 'Corrosion-free mounting structure engineered specifically for coastal weather conditions in Andhra Pradesh and West Bengal.',
    warranty: '25 Years Structural Integrity Warranty',
    imageUrl: 'https://images.unsplash.com/photo-1548611716-300481845110?auto=format&fit=crop&w=800&q=80',
    isFeatured: false,
    inventory: 120
  }
];

const defaultProjects: Project[] = [
  {
    id: 'proj-1',
    title: '15 kWp Luxury Residential Villa Solar Rooftop',
    category: 'Residential',
    location: 'Brodipet, Guntur',
    state: 'Andhra Pradesh',
    capacityKw: 15,
    annualSavingsRs: 185000,
    completionDate: '2026-03-15',
    status: 'Completed',
    images: [
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Custom elevated structural design allowing full rooftop usage below the panels. Installed with Sarva N-Type Bifacial panels and 5.12kWh lithium storage.',
    clientReview: {
      author: 'Dr. K. S. Rao',
      comment: 'Sarva Solar team completed the installation in just 2 days. My monthly electricity bill dropped from ₹18,000 to almost zero!',
      rating: 5
    }
  },
  {
    id: 'proj-2',
    title: '120 kWp Commercial Spinning Mill Rooftop',
    category: 'Commercial',
    location: 'Vijayawada Highway',
    state: 'Andhra Pradesh',
    capacityKw: 120,
    annualSavingsRs: 1420000,
    completionDate: '2026-01-20',
    status: 'Completed',
    images: [
      'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'Turnkey industrial EPC on standing seam metal roof. Integrated with live IoT power logging and net metering.',
    clientReview: {
      author: 'P. V. Ramana (MD, Sri Lakshmi Textiles)',
      comment: 'Top-class engineering! The accelerated depreciation savings alone paid off a huge chunk in year one.',
      rating: 5
    }
  },
  {
    id: 'proj-3',
    title: '50 kWp Educational Institute Solar Plant',
    category: 'Commercial',
    location: 'Warangal Urban',
    state: 'Telangana',
    capacityKw: 50,
    annualSavingsRs: 580000,
    completionDate: '2025-11-10',
    status: 'Completed',
    images: [
      'https://images.unsplash.com/photo-1548611716-300481845110?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'On-grid rooftop solar array meeting 85% of total campus energy requirements.',
    clientReview: {
      author: 'S. N. Murthy (Director)',
      comment: 'Very professional execution by Sarva Solar. Highly recommended for commercial institutes.',
      rating: 5
    }
  },
  {
    id: 'proj-4',
    title: '250 kWp Industrial Cold Storage Solar Facility',
    category: 'Industrial',
    location: 'Kolkata Industrial Zone',
    state: 'West Bengal',
    capacityKw: 250,
    annualSavingsRs: 2950000,
    completionDate: '2026-05-12',
    status: 'Ongoing',
    images: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'High-voltage MW-class setup currently undergoing final DISCOM grid synchronization testing.'
  }
];

const defaultBlogs: BlogArticle[] = [
  {
    id: 'blog-1',
    title: 'How to Claim Up to ₹78,000 Subsidy Under PM Surya Ghar Muft Bijli Yojana in 2026',
    slug: 'claim-pm-surya-ghar-subsidy-2026',
    category: 'Government Subsidy',
    author: 'Sarva Solar Technical Team',
    publishedAt: '2026-06-15',
    readTime: '5 min read',
    excerpt: 'A comprehensive step-by-step guide on eligibility, required documents, and applying for Central Govt solar rooftop subsidies.',
    content: `
### Understanding PM Surya Ghar Scheme
The Central Government's flagship PM Surya Ghar Muft Bijli Yojana aims to power 1 crore households across India with clean solar energy while providing up to 300 units of free electricity per month.

#### Subsidy Structure Breakdown:
- **1 kW System**: ₹30,000 direct subsidy
- **2 kW System**: ₹60,000 direct subsidy
- **3 kW to 10 kW Systems**: ₹78,000 maximum direct subsidy

#### Steps to Register with Sarva Solar Assistance:
1. Visit the national solar portal or register directly with **Sarva Solar** for end-to-end documentation.
2. Submit Aadhaar, recent electricity DISCOM bill, and bank passbook details.
3. Sarva Solar's certified engineers execute site inspection and submit technical feasibility.
4. Post-installation and net-meter commissioning, the subsidy amount is credited directly to your bank account via DBT.
    `,
    imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80',
    tags: ['PM Surya Ghar', 'Solar Subsidy', 'Rooftop Solar', 'Andhra Pradesh', 'Telangana'],
    isPublished: true
  },
  {
    id: 'blog-2',
    title: 'On-Grid vs Off-Grid vs Hybrid Solar Systems: Which One Should You Choose?',
    slug: 'on-grid-vs-off-grid-vs-hybrid-solar',
    category: 'Solar Buying Guide',
    author: 'Jupalli Venkatesh Kumar',
    publishedAt: '2026-05-28',
    readTime: '6 min read',
    excerpt: 'Compare initial costs, battery backup requirements, net metering benefits, and payback periods across solar plant types.',
    content: `
Choosing the right solar system architecture is critical to maximizing return on investment.

### 1. On-Grid Solar Systems
- **Best for**: Cities with stable grid power.
- **Pros**: Lowest cost per kW, qualifies for Govt subsidies, zero battery maintenance.
- **Cons**: Shuts down during grid outages for safety.

### 2. Hybrid Solar Systems
- **Best for**: Areas experiencing frequent power cuts.
- **Pros**: Combines net-meter grid savings with Lithium LFP battery power backup.
- **Cons**: Slightly higher upfront cost due to battery storage.
    `,
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    tags: ['Hybrid Solar', 'Inverters', 'Lithium Battery', 'Net Metering'],
    isPublished: true
  }
];

const defaultTestimonials: Testimonial[] = [
  {
    id: 't-1',
    customerName: 'K. Srinivasa Rao',
    location: 'Guntur, Andhra Pradesh',
    systemSizeKw: 5,
    rating: 5,
    comment: 'Sarva Solar installed a 5kW system on my home rooftop. The entire team was professional, clean, and guided us through the PM Surya Ghar subsidy effortlessly. Electricity bill is down from ₹6,500 to zero!',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    savedPerYear: '₹72,000 / year'
  },
  {
    id: 't-2',
    customerName: 'M. Anand Varma',
    location: 'Hyderabad, Telangana',
    systemSizeKw: 10,
    rating: 5,
    comment: 'We opted for a 10kW Hybrid system with lithium battery storage for our commercial office. Sarva Solar delivered on time with top-quality N-type bifacial panels. Incredible service!',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    savedPerYear: '₹1,35,000 / year'
  },
  {
    id: 't-3',
    customerName: 'Sujata Banerjee',
    location: 'Kolkata, West Bengal',
    systemSizeKw: 3,
    rating: 5,
    comment: 'Very happy with Sarva Solar. Their solar savings calculator was 100% accurate. Subsidy amount arrived straight into my account.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    savedPerYear: '₹42,000 / year'
  }
];

const defaultFaqs: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'General',
    question: 'How long do Sarva Solar panels last?',
    answer: 'Tier-1 solar panels provided by Sarva Solar come with a 25-30 year linear performance warranty, ensuring 80%+ efficiency generation even after 25 years.'
  },
  {
    id: 'faq-2',
    category: 'Subsidy',
    question: 'How do I receive the PM Surya Ghar government subsidy?',
    answer: 'Sarva Solar handles all application filings on the National Solar Portal. Once the net meter is installed by your DISCOM, the central government transfers up to ₹78,000 directly into your linked bank account via DBT within 30 days.'
  },
  {
    id: 'faq-3',
    category: 'Technical',
    question: 'What happens to solar generation during cloudy or rainy days?',
    answer: 'Solar panels still generate electricity on overcast days using diffuse sunlight (around 20% - 40% of peak capacity). On-grid systems draw remaining balance power seamlessly from the DISCOM grid.'
  },
  {
    id: 'faq-4',
    category: 'Billing',
    question: 'What is Net Metering?',
    answer: 'Net Metering is a bi-directional billing mechanism that credits solar energy system owners for the electricity they export to the grid. At the end of the month, you pay only for net units consumed.'
  }
];

const defaultGallery: GalleryItem[] = [
  {
    id: 'g-1',
    title: '5kW Villa Rooftop in Guntur',
    category: 'Residential',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1000&q=80',
    caption: 'Elevated HDG structure custom-built for full terrace space access.'
  },
  {
    id: 'g-2',
    title: '120kW Commercial Textile Mill Array',
    category: 'Commercial',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1000&q=80',
    caption: 'Standing seam non-penetrating solar installation in Vijayawada.'
  },
  {
    id: 'g-3',
    title: 'Drone Inspection View - 250kW Factory',
    category: 'Drone Views',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1000&q=80',
    caption: 'Aerial perspective of precision aligned high-efficiency solar modules.'
  }
];

const defaultLeads: Lead[] = [
  {
    id: 'lead-101',
    fullName: 'Rajesh Sharma',
    email: 'rajesh.sharma@gmail.com',
    phone: '+91 9848012345',
    state: 'Andhra Pradesh',
    city: 'Vijayawada',
    solarFor: 'Home',
    monthlyBill: '₹5,000 - ₹8,000',
    roofType: 'Concrete Terrace (RBC)',
    connectionType: 'On-Grid',
    financeInterest: 'Yes',
    status: 'New',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'lead-102',
    fullName: 'P. Venkat Rao',
    email: 'venkat.p@yahoo.com',
    phone: '+91 9177123456',
    state: 'Telangana',
    city: 'Hyderabad',
    solarFor: 'Business',
    monthlyBill: '₹25,000 - ₹50,000',
    roofType: 'Industrial Metal Roof',
    connectionType: 'Hybrid',
    financeInterest: 'Yes',
    status: 'Proposal Sent',
    assignedTo: 'Anil Kumar',
    notes: 'Requested site survey for 20kW system with battery backup.',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

const defaultQuotes: QuoteRequest[] = [
  {
    id: 'q-501',
    name: 'M. Sriman Narayana',
    phone: '+91 9440112233',
    email: 'sriman.m@gmail.com',
    state: 'Andhra Pradesh',
    city: 'Guntur',
    propertyType: 'Residential',
    monthlyBill: 4500,
    roofType: 'Terrace',
    proposedKw: 3,
    estimatedCost: 165000,
    estimatedSubsidy: 78000,
    netCost: 87000,
    status: 'Pending',
    message: 'Interested in 3kW on-grid solar system under PM Surya Ghar scheme.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

export class DataStore {
  private db: DatabaseSchema;

  constructor() {
    this.ensureDataDir();
    this.db = this.loadDatabase();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadDatabase(): DatabaseSchema {
    let loadedDb: any = null;
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        loadedDb = JSON.parse(raw);
      } catch (e) {
        console.error('Failed to parse db.json, reinitializing default store:', e);
      }
    }

    if (loadedDb) {
      if (!loadedDb.jobs) {
        loadedDb.jobs = [
          {
            id: 'job-1',
            title: 'Solar Sales & Business Development Manager',
            location: 'Guntur / Vijayawada / Hyderabad',
            type: 'Full-time',
            exp: '2+ Years in Solar EPC / Electrical Sales',
            desc: 'Responsible for lead conversion, commercial client consultations, and site survey coordination.',
            department: 'Sales & Business',
            isActive: true,
            postedDate: '2026-07-01'
          },
          {
            id: 'job-2',
            title: 'Senior Rooftop Solar Design Engineer',
            location: 'Guntur HQ',
            type: 'Full-time',
            exp: '2+ Years in Helioscope / AutoCAD / PVSyst',
            desc: 'Creating 3D shading simulations, electrical single line diagrams (SLD), and structural BOM calculations.',
            department: 'Engineering',
            isActive: true,
            postedDate: '2026-07-05'
          },
          {
            id: 'job-3',
            title: 'Rooftop Site Installation Supervisor',
            location: 'Andhra Pradesh & Telangana Regions',
            type: 'Full-time',
            exp: '1+ Year in Solar Rooftop Mounting',
            desc: 'On-site supervisory execution of structural mounting, DC cabling, inverter sync, and DISCOM testing.',
            department: 'Operations',
            isActive: true,
            postedDate: '2026-07-10'
          }
        ];
      }
      if (!loadedDb.jobApplications) {
        loadedDb.jobApplications = [
          {
            id: 'app-1',
            jobId: 'job-2',
            name: 'Karthik Raja',
            phone: '+91 9876543210',
            email: 'karthik.solar@gmail.com',
            role: 'Senior Rooftop Solar Design Engineer',
            experience: '3 Years in AutoCAD & Helioscope',
            message: 'B.Tech Electrical graduate with 3 years experience designing 10kW - 200kW rooftop projects.',
            status: 'Shortlisted',
            createdAt: '2026-07-20T10:30:00.000Z'
          }
        ];
      }
      if (!loadedDb.visitorLogs) {
        loadedDb.visitorLogs = [];
      }
      if (!loadedDb.emailNotifications) {
        loadedDb.emailNotifications = [];
      }
      if (!loadedDb.heroSlides || loadedDb.heroSlides.length === 0) {
        loadedDb.heroSlides = defaultHeroSlides;
      }

      // Ensure sarvasolars@gmail.com admin account and password exist in loaded DB
      if (!loadedDb.users) loadedDb.users = [];
      if (!loadedDb.passwords) loadedDb.passwords = {};

      let sarvaAdmin = loadedDb.users.find((u: any) => u.email.toLowerCase() === 'sarvasolars@gmail.com');
      if (!sarvaAdmin) {
        sarvaAdmin = {
          id: 'usr-0',
          name: 'Sarva Solar Admin',
          email: 'sarvasolars@gmail.com',
          role: 'Admin',
          phone: '+91 8985430100',
          createdAt: new Date().toISOString()
        };
        loadedDb.users.unshift(sarvaAdmin);
      }
      if (!loadedDb.passwords[sarvaAdmin.id]) {
        loadedDb.passwords[sarvaAdmin.id] = bcrypt.hashSync('Sarva@1234', 10);
      }

      // Also ensure fallback admin@sarvasolar.com password exists
      const fallbackAdmin = loadedDb.users.find((u: any) => u.email.toLowerCase() === 'admin@sarvasolar.com');
      if (fallbackAdmin && !loadedDb.passwords[fallbackAdmin.id]) {
        loadedDb.passwords[fallbackAdmin.id] = bcrypt.hashSync('admin123', 10);
      }

      this.saveDatabase(loadedDb);
      return loadedDb;
    }

    // Default passwords
    const initialPasswords: Record<string, string> = {
      'usr-0': bcrypt.hashSync('Sarva@1234', 10),
      'usr-1': bcrypt.hashSync('admin123', 10),
      'usr-2': bcrypt.hashSync('manager123', 10),
      'usr-3': bcrypt.hashSync('employee123', 10)
    };

    const initialDb: DatabaseSchema = {
      users: defaultUsers,
      passwords: initialPasswords,
      leads: defaultLeads,
      quotes: defaultQuotes,
      products: defaultProducts,
      projects: defaultProjects,
      blogs: defaultBlogs,
      services: defaultServices,
      subsidies: defaultSubsidies,
      testimonials: defaultTestimonials,
      faqs: defaultFaqs,
      gallery: defaultGallery,
      jobs: [
        {
          id: 'job-1',
          title: 'Solar Sales & Business Development Manager',
          location: 'Guntur / Vijayawada / Hyderabad',
          type: 'Full-time',
          exp: '2+ Years in Solar EPC / Electrical Sales',
          desc: 'Responsible for lead conversion, commercial client consultations, and site survey coordination.',
          department: 'Sales & Business',
          isActive: true,
          postedDate: '2026-07-01'
        },
        {
          id: 'job-2',
          title: 'Senior Rooftop Solar Design Engineer',
          location: 'Guntur HQ',
          type: 'Full-time',
          exp: '2+ Years in Helioscope / AutoCAD / PVSyst',
          desc: 'Creating 3D shading simulations, electrical single line diagrams (SLD), and structural BOM calculations.',
          department: 'Engineering',
          isActive: true,
          postedDate: '2026-07-05'
        },
        {
          id: 'job-3',
          title: 'Rooftop Site Installation Supervisor',
          location: 'Andhra Pradesh & Telangana Regions',
          type: 'Full-time',
          exp: '1+ Year in Solar Rooftop Mounting',
          desc: 'On-site supervisory execution of structural mounting, DC cabling, inverter sync, and DISCOM testing.',
          department: 'Operations',
          isActive: true,
          postedDate: '2026-07-10'
        }
      ],
      jobApplications: [
        {
          id: 'app-1',
          jobId: 'job-2',
          name: 'Karthik Raja',
          phone: '+91 9876543210',
          email: 'karthik.solar@gmail.com',
          role: 'Senior Rooftop Solar Design Engineer',
          experience: '3 Years in AutoCAD & Helioscope',
          message: 'B.Tech Electrical graduate with 3 years experience designing 10kW - 200kW rooftop projects.',
          status: 'Shortlisted',
          createdAt: '2026-07-20T10:30:00.000Z'
        }
      ],
      settings: defaultSettings,
      heroSlides: defaultHeroSlides,
      auditLogs: [
        {
          id: 'log-1',
          timestamp: new Date().toISOString(),
          userEmail: 'system',
          action: 'INIT',
          details: 'Sarva Solar Database initialized with seed data'
        }
      ]
    };

    this.saveDatabase(initialDb);
    return initialDb;
  }

  private saveDatabase(data?: DatabaseSchema) {
    try {
      const dbToSave = data || this.db;
      fs.writeFileSync(DB_FILE, JSON.stringify(dbToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing to db.json:', err);
    }
  }

  public getDb(): DatabaseSchema {
    return this.db;
  }

  public logAudit(userEmail: string, action: string, details: string) {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userEmail,
      action,
      details
    };
    this.db.auditLogs.unshift(newLog);
    if (this.db.auditLogs.length > 200) {
      this.db.auditLogs = this.db.auditLogs.slice(0, 200);
    }
    this.saveDatabase();
  }

  // Users & Passwords
  public getUsers() {
    return this.db.users;
  }

  public getUserByEmail(email: string) {
    return this.db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public verifyPassword(userId: string, passwordPlain: string): boolean {
    const hashed = this.db.passwords[userId];
    if (!hashed) return false;
    return bcrypt.compareSync(passwordPlain, hashed);
  }

  public addUser(user: User, passwordPlain: string) {
    this.db.users.push(user);
    this.db.passwords[user.id] = bcrypt.hashSync(passwordPlain, 10);
    this.saveDatabase();
  }

  public updateUserPassword(userId: string, newPasswordPlain: string): boolean {
    if (!this.db.passwords[userId]) return false;
    this.db.passwords[userId] = bcrypt.hashSync(newPasswordPlain, 10);
    this.saveDatabase();
    return true;
  }

  public updateUserProfile(userId: string, updates: { name?: string; email?: string; phone?: string }): User | null {
    const uIdx = this.db.users.findIndex((u) => u.id === userId);
    if (uIdx === -1) return null;
    this.db.users[uIdx] = {
      ...this.db.users[uIdx],
      ...updates
    };
    this.saveDatabase();
    return this.db.users[uIdx];
  }

  public updateUser(userId: string, updates: Partial<User>, newPasswordPlain?: string): User | null {
    const uIdx = this.db.users.findIndex((u) => u.id === userId);
    if (uIdx === -1) return null;
    this.db.users[uIdx] = {
      ...this.db.users[uIdx],
      ...updates
    };
    if (newPasswordPlain && newPasswordPlain.trim().length > 0) {
      this.db.passwords[userId] = bcrypt.hashSync(newPasswordPlain, 10);
    }
    this.saveDatabase();
    return this.db.users[uIdx];
  }

  public deleteUser(userId: string): boolean {
    const initialLen = this.db.users.length;
    this.db.users = this.db.users.filter((u) => u.id !== userId);
    delete this.db.passwords[userId];
    const deleted = this.db.users.length < initialLen;
    if (deleted) {
      this.saveDatabase();
    }
    return deleted;
  }

  // Leads
  public getLeads() {
    return this.db.leads;
  }

  public addLead(lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Lead {
    const newLead: Lead = {
      ...lead,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.db.leads.unshift(newLead);
    this.saveDatabase();
    return newLead;
  }

  public updateLead(id: string, updates: Partial<Lead>): Lead | null {
    const idx = this.db.leads.findIndex((l) => l.id === id);
    if (idx === -1) return null;
    this.db.leads[idx] = {
      ...this.db.leads[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveDatabase();
    return this.db.leads[idx];
  }

  public deleteLead(id: string): boolean {
    const initialLen = this.db.leads.length;
    this.db.leads = this.db.leads.filter((l) => l.id !== id);
    const deleted = this.db.leads.length < initialLen;
    if (deleted) this.saveDatabase();
    return deleted;
  }

  // Quotes
  public getQuotes() {
    return this.db.quotes;
  }

  public addQuote(quote: Omit<QuoteRequest, 'id' | 'createdAt'>): QuoteRequest {
    const newQuote: QuoteRequest = {
      ...quote,
      id: `q-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.db.quotes.unshift(newQuote);
    this.saveDatabase();
    return newQuote;
  }

  public updateQuoteStatus(id: string, status: QuoteRequest['status']) {
    const quote = this.db.quotes.find((q) => q.id === id);
    if (quote) {
      quote.status = status;
      this.saveDatabase();
    }
    return quote;
  }

  // Products
  public getProducts() {
    return this.db.products;
  }

  public addProduct(product: Omit<Product, 'id'>): Product {
    const newProd: Product = {
      ...product,
      id: `prod-${Date.now()}`
    };
    this.db.products.unshift(newProd);
    this.saveDatabase();
    return newProd;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.db.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.db.products[idx] = { ...this.db.products[idx], ...updates };
    this.saveDatabase();
    return this.db.products[idx];
  }

  public deleteProduct(id: string): boolean {
    const len = this.db.products.length;
    this.db.products = this.db.products.filter((p) => p.id !== id);
    if (this.db.products.length < len) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // Projects
  public getProjects() {
    return this.db.projects;
  }

  public addProject(project: Omit<Project, 'id'>): Project {
    const newProj: Project = { ...project, id: `proj-${Date.now()}` };
    this.db.projects.unshift(newProj);
    this.saveDatabase();
    return newProj;
  }

  public updateProject(id: string, updates: Partial<Project>): Project | null {
    const idx = this.db.projects.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.db.projects[idx] = { ...this.db.projects[idx], ...updates };
    this.saveDatabase();
    return this.db.projects[idx];
  }

  public deleteProject(id: string): boolean {
    const len = this.db.projects.length;
    this.db.projects = this.db.projects.filter((p) => p.id !== id);
    if (this.db.projects.length < len) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // Blogs
  public getBlogs() {
    return this.db.blogs;
  }

  public addBlog(blog: Omit<BlogArticle, 'id'>): BlogArticle {
    const newBlog: BlogArticle = { ...blog, id: `blog-${Date.now()}` };
    this.db.blogs.unshift(newBlog);
    this.saveDatabase();
    return newBlog;
  }

  public updateBlog(id: string, updates: Partial<BlogArticle>): BlogArticle | null {
    const idx = this.db.blogs.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    this.db.blogs[idx] = { ...this.db.blogs[idx], ...updates };
    this.saveDatabase();
    return this.db.blogs[idx];
  }

  public deleteBlog(id: string): boolean {
    const len = this.db.blogs.length;
    this.db.blogs = this.db.blogs.filter((b) => b.id !== id);
    if (this.db.blogs.length < len) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // Subsidies
  public getSubsidies() {
    return this.db.subsidies;
  }

  public addSubsidy(subsidy: Omit<SubsidyDetail, 'id'>): SubsidyDetail {
    const newSub: SubsidyDetail = {
      ...subsidy,
      id: `sub-${Date.now()}`,
      updatedDate: new Date().toISOString().split('T')[0]
    };
    this.db.subsidies.push(newSub);
    this.saveDatabase();
    return newSub;
  }

  public updateSubsidy(id: string, updates: Partial<SubsidyDetail>) {
    const idx = this.db.subsidies.findIndex((s) => s.id === id);
    if (idx !== -1) {
      this.db.subsidies[idx] = { ...this.db.subsidies[idx], ...updates, updatedDate: new Date().toISOString().split('T')[0] };
      this.saveDatabase();
      return this.db.subsidies[idx];
    }
    return null;
  }

  public deleteSubsidy(id: string): boolean {
    const len = this.db.subsidies.length;
    this.db.subsidies = this.db.subsidies.filter((s) => s.id !== id);
    if (this.db.subsidies.length < len) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // Services
  public getServices() {
    return this.db.services;
  }

  public addService(service: Omit<ServiceItem, 'id'>): ServiceItem {
    const newSvc: ServiceItem = {
      ...service,
      id: `svc-${Date.now()}`
    };
    this.db.services.push(newSvc);
    this.saveDatabase();
    return newSvc;
  }

  public updateService(id: string, updates: Partial<ServiceItem>): ServiceItem | null {
    const idx = this.db.services.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.db.services[idx] = { ...this.db.services[idx], ...updates };
    this.saveDatabase();
    return this.db.services[idx];
  }

  public deleteService(id: string): boolean {
    const len = this.db.services.length;
    this.db.services = this.db.services.filter((s) => s.id !== id);
    if (this.db.services.length < len) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // Testimonials
  public getTestimonials() {
    return this.db.testimonials;
  }

  public addTestimonial(t: Omit<Testimonial, 'id'>): Testimonial {
    const newT: Testimonial = { ...t, id: `testi-${Date.now()}` };
    this.db.testimonials.unshift(newT);
    this.saveDatabase();
    return newT;
  }

  public updateTestimonial(id: string, updates: Partial<Testimonial>): Testimonial | null {
    const idx = this.db.testimonials.findIndex((item) => item.id === id);
    if (idx === -1) return null;
    this.db.testimonials[idx] = { ...this.db.testimonials[idx], ...updates };
    this.saveDatabase();
    return this.db.testimonials[idx];
  }

  public deleteTestimonial(id: string): boolean {
    const len = this.db.testimonials.length;
    this.db.testimonials = this.db.testimonials.filter((item) => item.id !== id);
    if (this.db.testimonials.length < len) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // FAQs
  public getFaqs() {
    return this.db.faqs;
  }

  public addFaq(faq: Omit<FAQItem, 'id'>): FAQItem {
    const newFaq: FAQItem = { ...faq, id: `faq-${Date.now()}` };
    this.db.faqs.push(newFaq);
    this.saveDatabase();
    return newFaq;
  }

  public updateFaq(id: string, updates: Partial<FAQItem>): FAQItem | null {
    const idx = this.db.faqs.findIndex((item) => item.id === id);
    if (idx === -1) return null;
    this.db.faqs[idx] = { ...this.db.faqs[idx], ...updates };
    this.saveDatabase();
    return this.db.faqs[idx];
  }

  public deleteFaq(id: string): boolean {
    const len = this.db.faqs.length;
    this.db.faqs = this.db.faqs.filter((item) => item.id !== id);
    if (this.db.faqs.length < len) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // Gallery
  public getGallery() {
    return this.db.gallery;
  }

  public addGalleryItem(item: Omit<GalleryItem, 'id'>): GalleryItem {
    const newItem: GalleryItem = { ...item, id: `gal-${Date.now()}` };
    this.db.gallery.unshift(newItem);
    this.saveDatabase();
    return newItem;
  }

  public updateGalleryItem(id: string, updates: Partial<GalleryItem>): GalleryItem | null {
    const idx = this.db.gallery.findIndex((item) => item.id === id);
    if (idx === -1) return null;
    this.db.gallery[idx] = { ...this.db.gallery[idx], ...updates };
    this.saveDatabase();
    return this.db.gallery[idx];
  }

  public deleteGalleryItem(id: string): boolean {
    const len = this.db.gallery.length;
    this.db.gallery = this.db.gallery.filter((item) => item.id !== id);
    if (this.db.gallery.length < len) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // Settings
  public getSettings() {
    return this.db.settings;
  }

  public updateSettings(updates: Partial<AppSettings>) {
    this.db.settings = { ...this.db.settings, ...updates };
    this.saveDatabase();
    return this.db.settings;
  }

  // Jobs
  public getJobs() {
    return this.db.jobs || [];
  }

  public addJob(job: Omit<JobOpening, 'id'>): JobOpening {
    const newJob: JobOpening = {
      ...job,
      id: `job-${Date.now()}`,
      postedDate: job.postedDate || new Date().toISOString().split('T')[0]
    };
    if (!this.db.jobs) this.db.jobs = [];
    this.db.jobs.unshift(newJob);
    this.saveDatabase();
    return newJob;
  }

  public updateJob(id: string, updates: Partial<JobOpening>): JobOpening | null {
    if (!this.db.jobs) return null;
    const idx = this.db.jobs.findIndex((j) => j.id === id);
    if (idx === -1) return null;
    this.db.jobs[idx] = { ...this.db.jobs[idx], ...updates };
    this.saveDatabase();
    return this.db.jobs[idx];
  }

  public deleteJob(id: string): boolean {
    if (!this.db.jobs) return false;
    const len = this.db.jobs.length;
    this.db.jobs = this.db.jobs.filter((j) => j.id !== id);
    if (this.db.jobs.length < len) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // Job Applications
  public getJobApplications() {
    return this.db.jobApplications || [];
  }

  public addJobApplication(app: Omit<JobApplication, 'id' | 'createdAt' | 'status'>): JobApplication {
    const newApp: JobApplication = {
      ...app,
      id: `app-${Date.now()}`,
      status: 'New',
      createdAt: new Date().toISOString()
    };
    if (!this.db.jobApplications) this.db.jobApplications = [];
    this.db.jobApplications.unshift(newApp);
    this.saveDatabase();
    return newApp;
  }

  public updateJobApplicationStatus(id: string, status: JobApplication['status']): JobApplication | null {
    if (!this.db.jobApplications) return null;
    const idx = this.db.jobApplications.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    this.db.jobApplications[idx].status = status;
    this.saveDatabase();
    return this.db.jobApplications[idx];
  }

  public deleteJobApplication(id: string): boolean {
    if (!this.db.jobApplications) return false;
    const len = this.db.jobApplications.length;
    this.db.jobApplications = this.db.jobApplications.filter((a) => a.id !== id);
    if (this.db.jobApplications.length < len) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // Visitor Tracking
  public getVisitorLogs(): VisitorLog[] {
    return this.db.visitorLogs || [];
  }

  public addVisitorLog(log: Omit<VisitorLog, 'id' | 'timestamp'>): VisitorLog {
    const newLog: VisitorLog = {
      ...log,
      id: `vlog-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString()
    };
    if (!this.db.visitorLogs) this.db.visitorLogs = [];
    this.db.visitorLogs.unshift(newLog);
    if (this.db.visitorLogs.length > 500) {
      this.db.visitorLogs = this.db.visitorLogs.slice(0, 500);
    }
    this.saveDatabase();
    return newLog;
  }

  // Email Notifications
  public getEmailNotifications(): EmailNotification[] {
    return this.db.emailNotifications || [];
  }

  public addEmailNotification(
    notification: Omit<EmailNotification, 'id' | 'sentAt'> & { status?: EmailNotification['status'] }
  ): EmailNotification {
    const newNotification: EmailNotification = {
      ...notification,
      id: `mail-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status: notification.status || 'Pending',
      sentAt: new Date().toISOString()
    };
    if (!this.db.emailNotifications) this.db.emailNotifications = [];
    this.db.emailNotifications.unshift(newNotification);
    this.saveDatabase();
    return newNotification;
  }

  public updateEmailNotificationStatus(
    id: string,
    status: EmailNotification['status'],
    deliveryMethod?: string,
    errorMessage?: string
  ): void {
    if (!this.db.emailNotifications) return;
    const item = this.db.emailNotifications.find((e) => e.id === id);
    if (item) {
      item.status = status;
      if (deliveryMethod) item.deliveryMethod = deliveryMethod;
      if (errorMessage) item.errorMessage = errorMessage;
      this.saveDatabase();
    }
  }

  // Hero Slides Management
  public getHeroSlides(): HeroSlide[] {
    const slides = this.db.heroSlides || [];
    return [...slides].sort((a, b) => a.order - b.order);
  }

  public addHeroSlide(slideData: Omit<HeroSlide, 'id'>): HeroSlide {
    if (!this.db.heroSlides) this.db.heroSlides = [];
    const newSlide: HeroSlide = {
      ...slideData,
      id: `slide-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    this.db.heroSlides.push(newSlide);
    this.saveDatabase();
    return newSlide;
  }

  public updateHeroSlide(id: string, updates: Partial<HeroSlide>): HeroSlide {
    if (!this.db.heroSlides) this.db.heroSlides = [];
    const index = this.db.heroSlides.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error('Hero slide not found');
    }
    this.db.heroSlides[index] = {
      ...this.db.heroSlides[index],
      ...updates
    };
    this.saveDatabase();
    return this.db.heroSlides[index];
  }

  public deleteHeroSlide(id: string): void {
    if (!this.db.heroSlides) return;
    this.db.heroSlides = this.db.heroSlides.filter((s) => s.id !== id);
    this.saveDatabase();
  }
}

export const store = new DataStore();
